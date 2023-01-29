import React from 'react';
import Cond from './Cond';
import { composeExcerpt } from './_util';
export default function Meta({ as = 'head', title, desc, image, canonical, noindex, siteIcon, touchIcon, themeColor, children }) {
    const description = composeExcerpt(desc !== null && desc !== void 0 ? desc : '', 155, false);
    return (<Cond as={as}>
      <title>{title}</title>
      <link rel='icon' href={siteIcon}/>
      {touchIcon && <link rel='apple-touch-icon' href={touchIcon}/>}
      {themeColor && <meta name='theme-color' content={themeColor}/>}

      {canonical && <link rel='canonical' href={canonical}/>}
      {noindex && <meta name='robots' content='noindex'/>}

      <meta property='og:type' content='article'/>
      <meta property='og:title' content={title}/>
      <meta name='description' content={description}/>
      {image && <meta property='og:image' content={image}/>}

      <meta name='twitter:card' content='summary_large_image'/>
      <meta name='twitter:title' content={title}/>
      <meta name='twitter:description' content={description}/>
      {image && <meta name='twitter:image' content={image}/>}

      {children}
    </Cond>);
}
//# sourceMappingURL=Meta.jsx.map