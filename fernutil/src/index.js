export const sst = () =>
  selector => document.querySelector(selector).scrollIntoView({ behavior: 'smooth' })

export const cn = (...classes) =>
  classes.filter(Boolean).join(' ')

export const chunk = (arr, size) => {
  if (!Array.isArray(arr)) return []
  if (!size || size < 1) return arr
  return arr.reduce((acc, _, i) => (i % size) ? acc : [...acc, arr.slice(i, i + size)], [])
}

export const isEmail = str =>
	/^\S+@\S+\.\S+$/.test(str || '')

export const composeSlug = str =>
	(str || '').toLowerCase().replace(/[^\w\s\-/]+/g, '').replace(/[\s\-]+/g, '-')

export const escapeHtml = str =>
  (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');

export const purifyString = str =>
  (str || '').replace(/<\/[^>]+>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()

export const composeExcerpt = (str, charLimit, useEllipsis = true) => {
  if (!str) return ''
  if (!charLimit || str.length <= charLimit) return str
  return purifyString(str).substring(0, charLimit).split(' ').slice(0, -1).join(' ') + (useEllipsis ? '...' : '')
}

export const composeFacebookShareLink = url =>
  !url ? '' : 'https://www.facebook.com/sharer/sharer.php?u=' + url

export const composeTwitterShareLink = url =>
  !url ? '' : 'https://twitter.com/intent/tweet?text=' + url
  
export const purifySubmitFields = submitEvent =>
  [...submitEvent.target.elements].filter(field => field.name && field.value && !field.name.startsWith('fui-config') 
    && (field.type !== 'radio' || field.checked))
  
export const formToHtml = (heading = 'Form Submission', submitEvent) => {
  let html = `<h3 style='margin: 0 0 12px 0;'>${heading}</h3> <ul style='padding: 0 0 0 24px; margin: 0;'>`

  purifySubmitFields(submitEvent).forEach(field => {
    const fieldTitle = purifyString(field.name.replace(/\*/g, ''))
    const fieldValue = field.type !== 'checkbox' ? purifyString(field.value) : (field.checked ? 'Yes' : 'No')

    html += `<li style='margin: 0 0 12px 0;'>
      <span style='font-weight: bold;'>${fieldTitle}:</span> <br>${fieldValue}
    </li>`
  })

  return html + '</ul>'
}

export const formToValues = submitEvent => {
  const concat = (obj = {}, [key, value]) => {
    const keys = key.split('.')
    const values = keys.length === 1 
      ? purifyString(value)
      : concat(obj[keys[0]], [keys.slice(1).join('.'), value])
      
    return { ...obj, [keys[0]]: values }
  }

  return [...(new FormData(submitEvent.target)).entries()].reduce(concat, {})
}

export const closeAllMenus = () =>
	document.querySelectorAll('.fui-menu-close').forEach(c => c.click())

export const signalModal = (selector, value) => {
  typeof selector === 'string' 
    ? document.querySelector(selector)?.querySelector(`.fui-modal-${value}`).click()
    : selector.currentTarget.closest('.fui-modal').querySelector(`.fui-modal-${value}`).click()
}

export const toggleModal = selector =>
  signalModal(selector, 'toggle')

export const openModal = selector =>
  signalModal(selector, 'open')

export const closeModal = selector =>
  signalModal(selector, 'close')

export const useIntersect = (selector, callback, offset = '0px 0px 0px 0px', once = true) => {
  document.querySelectorAll(selector).forEach(target => {
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        callback(entry.target)
        if (once) observer.disconnect()
      })
    }, { rootMargin: offset })
    io.observe(target)
  })
}

export const lazyLoad = (offset = '750px') => {
  useIntersect('[data-lazy-src]', media =>
    media.setAttribute('src', media.getAttribute('data-lazy-src'))
  , `${offset} ${offset} ${offset} ${offset}`)
  useIntersect('[data-lazy-srcset]', media =>
    media.setAttribute('srcset', media.getAttribute('data-lazy-srcset'))
  , `${offset} ${offset} ${offset} ${offset}`)
}

export const scrollView = (offset = '999999px 0px -25% 0px') =>
  useIntersect('.scroll-view', section => section.classList.replace('scroll-view', 'scroll-view-active'), offset)

export const animLetters = (selector, start = 0, step = 25) => {
  document.querySelectorAll(selector).forEach(e => {
    let index = 0
    e.classList.add('anim-letters')

    e.innerHTML = e.innerHTML.split(' ').map(word => '<span style="display: inline-flex;">' +
      word.split('').map(l => 
        `<div class="anim-letter" style="display: inline-block; animation-delay: ${index++ * step + start}ms">${l}</div>`
      ).join('')
    + '</span>').join(' ')
  })
}