import React from 'react';
import { Cond } from '..';
import { composeExcerpt } from '../util';
export default function Meta({ as = 'head', title, desc, image, canonical, noindex, siteIcon, touchIcon, themeColor, children }) {
    const description = composeExcerpt(desc ?? '', 155, false);
    return (React.createElement(Cond, { as: as },
        React.createElement("title", null, title),
        React.createElement("link", { rel: 'icon', href: siteIcon }),
        touchIcon && React.createElement("link", { rel: 'apple-touch-icon', href: touchIcon }),
        themeColor && React.createElement("meta", { name: 'theme-color', content: themeColor }),
        canonical && React.createElement("link", { rel: 'canonical', href: canonical }),
        noindex && React.createElement("meta", { name: 'robots', content: 'noindex' }),
        React.createElement("meta", { property: 'og:type', content: 'article' }),
        React.createElement("meta", { property: 'og:title', content: title }),
        React.createElement("meta", { name: 'description', content: description }),
        image && React.createElement("meta", { property: 'og:image', content: image }),
        React.createElement("meta", { name: 'twitter:card', content: 'summary_large_image' }),
        React.createElement("meta", { name: 'twitter:title', content: title }),
        React.createElement("meta", { name: 'twitter:description', content: description }),
        image && React.createElement("meta", { name: 'twitter:image', content: image }),
        children));
}
