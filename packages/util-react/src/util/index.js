export const ss = (selector) => () => document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });
export const cn = (...classes) => classes.filter(Boolean).join(' ');
export const chunk = (arr, size) => {
    if (!Array.isArray(arr))
        return [];
    if (!size || size < 1)
        return arr;
    return arr.reduce((acc, _, i) => (i % size) ? acc : [...acc, arr.slice(i, i + size)], []);
};
export const isEmail = (str) => /^\S+@\S+\.\S+$/.test(str || '');
export const composeSlug = (str) => (str || '').toLowerCase().replace(/[^\w\s\-/]+/g, '').replace(/[\s\-]+/g, '-');
export const escapeHtml = (str) => (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
export const removeHtml = (str) => (str || '').replace(/<\/[^>]+>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
export const composeExcerpt = (str, charLimit, useEllipsis = true) => {
    if (!str)
        return '';
    if (!charLimit || str.length <= charLimit)
        return str;
    return escapeHtml(str).substring(0, charLimit).split(' ').slice(0, -1).join(' ') + (useEllipsis ? '...' : '');
};
export const composeFacebookShareLink = (url) => 'https://www.facebook.com/sharer/sharer.php?u=' + (url || '');
export const composeTwitterShareLink = (url) => 'https://twitter.com/intent/tweet?text=' + (url || '');
export const purifySubmitFields = (submitEvent) => [...submitEvent.target?.elements].filter(field => field.name && field.value && !field.name.startsWith('fui-config')
    && (field.type !== 'radio' || field.checked));
export const formToHtml = (heading = 'Form Submission', submitEvent) => {
    let html = heading
        ? `<h3 style='margin: 0 0 12px 0;'>${heading}</h3> <ul style='padding: 0 0 0 24px; margin: 0;'>`
        : '';
    purifySubmitFields(submitEvent).forEach(field => {
        const title = escapeHtml(field.name.replace(/\*/g, ''));
        const value = field.type !== 'checkbox' ? escapeHtml(field.value) : (field.checked ? 'Yes' : 'No');
        html += `<li style='margin: 0 0 12px 0;'><span style='font-weight: bold;'>${title}:</span> <br>${value}</li>`;
    });
    return html + '</ul>';
};
export const formToObject = (submitEvent) => {
    const concat = (acc, [key, value]) => {
        const keys = key.split('.');
        const values = keys.length === 1
            ? escapeHtml(value)
            : concat(acc ? acc[keys[0]] : null, [keys.slice(1).join('.'), value]);
        if (!(+keys[0] >= 0))
            return { ...acc, [keys[0]]: values };
        const arr = acc || [];
        arr[keys[0]] = values;
        return arr;
    };
    return [...(new FormData(submitEvent.target)).entries()].reduce(concat, null);
};
export async function query(url, { method = 'POST', headers, ...body }, json = false) {
    const res = await fetch(url, {
        method,
        body: JSON.stringify(body),
        headers: {
            'content-type': 'application/json',
            ...headers
        },
    });
    return json ? await res.json() : res;
}
const signalEvent = (selector, event, detail) => {
    const element = typeof selector === 'string'
        ? document.querySelector(selector)
        : selector?.current
            || selector?.currentTarget?.closest('.fui-listener');
    element?.dispatchEvent(new CustomEvent(event, { detail }));
};
export const closeModal = (selector, data) => signalEvent(selector, 'FernModalAction', { action: 0, ...(data ?? {}) });
export const openModal = (selector, data) => signalEvent(selector, 'FernModalAction', { action: 1, ...(data ?? {}) });
export const toggleModal = (selector, data) => signalEvent(selector, 'FernModalAction', { action: 2, ...(data ?? {}) });
export const closeExpand = (selector, data) => signalEvent(selector, 'FernExpandAction', { action: 0, ...(data ?? {}) });
export const openExpand = (selector, data) => signalEvent(selector, 'FernExpandAction', { action: 1, ...(data ?? {}) });
export const toggleExpand = (selector, data) => signalEvent(selector, 'FernExpandAction', { action: 2, ...(data ?? {}) });
export const onIntersect = (selector, callback, offset = '0px 0px 0px 0px', once = true) => {
    document.querySelectorAll(selector).forEach(element => {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting)
                    return;
                callback(entry.target);
                if (once)
                    observer.disconnect();
            });
        }, { rootMargin: offset });
        observer.observe(element);
    });
};
export const initLazyLoad = (offset = '750px') => {
    onIntersect('[data-lazy-src]', (element) => {
        element.setAttribute('src', element.getAttribute('data-lazy-src') ?? '');
        element.src = element.dataset['lazy-src'] ?? '';
    }, `${offset} ${offset} ${offset} ${offset}`);
    onIntersect('[data-lazy-srcset]', (element) => {
        element.src = element.dataset['lazy-src'] ?? '';
    }, `${offset} ${offset} ${offset} ${offset}`);
};
export const initScrollView = (offset = '999999px 0px -25% 0px') => onIntersect('.scroll-view', (element) => element.classList.add('scroll-view-active'), offset);
export const initSplitLetters = (selector, delay = 0, step = 25) => {
    document.querySelectorAll(selector).forEach(element => {
        let letterIndex = 0;
        element.innerHTML = element.innerHTML.split(' ').map(word => '<span style="display: inline-flex;">' +
            word.split('').map(letter => `<div class="split-letter" style="display: inline-block; animation-delay: ${letterIndex++ * step + delay}ms">${letter}</div>`).join('')
            + '</span>').join(' ');
    });
};
