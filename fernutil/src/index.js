export const sst = selector => () =>
  document.querySelector(selector).scrollIntoView({ behavior: 'smooth' })

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

export const removeHtml = str =>
  (str || '').replace(/<\/[^>]+>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()

// export const cleanHtml = (str, allowedTags = []) => {
//   if (!str || typeof str !== 'string') return ''

//   const dangerousTags = 'comment,embed,link,meta,noscript,object,script,style'
//   const dom = document.createElement('span')
//   dom.innerHTML = str

//   if (allowedTags)
//     dom.querySelectorAll('*').forEach(e => !allowedTags.includes(e.tagName) && e.remove())
//   else
//     dom.querySelectorAll(dangerousTags).forEach(e => e.remove())

//   dom.querySelectorAll('*').forEach(element => {
//     element.attributes.forEach(att => {
//       const name = att.name
//       const value = att.value.replace(/\s+/g, '').toLowerCase()

//       if (name.startsWith('on') || value.includes('javascript:') || value.includes('data:'))
//         element.removeAttribute(name)
//     })
//   })
  
//   return dom.innerHTML
// }

export const composeExcerpt = (str, charLimit, useEllipsis = true) => {
  if (!str) return ''
  if (!charLimit || str.length <= charLimit) return str
  return escapeHtml(str).substring(0, charLimit).split(' ').slice(0, -1).join(' ') + (useEllipsis ? '...' : '')
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
    const fieldTitle = escapeHtml(field.name.replace(/\*/g, ''))
    const fieldValue = field.type !== 'checkbox' ? escapeHtml(field.value) : (field.checked ? 'Yes' : 'No')

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
      ? escapeHtml(value)
      : concat(obj[keys[0]], [keys.slice(1).join('.'), value])
      
    return { ...obj, [keys[0]]: values }
  }

  return [...(new FormData(submitEvent.target)).entries()].reduce(concat, {})
}

const signalModal = (selector, action, index) => {
  const target = typeof selector === 'string' 
    ? document.querySelector(selector)
    : selector.currentTarget.closest('.fui-modal')
      
  target?.dispatchEvent(new CustomEvent('FernModalAction', { detail: { action, index } }))
}
  
export const closeModal = selector =>
  signalModal(selector, 0)

export const openModal = (selector, index) =>
  signalModal(selector, 1, index)

export const toggleModal = selector =>
  signalModal(selector, 2)

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