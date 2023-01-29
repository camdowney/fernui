import { __rest } from "tslib";
import React from 'react';
import Cond from './Cond';
import { cn } from './_util';
export default function Media(_a) {
    var { as = 'img', src, className, style, innerClass, alt = '', placeholder, cover, auto, priority } = _a, props = __rest(_a, ["as", "src", "className", "style", "innerClass", "alt", "placeholder", "cover", "auto", "priority"]);
    const responsive = as === 'img' && src && src.includes('.webp') && !src.startsWith('http');
    const srcset = `/sm/${src} 640w, /md/${src} 1024w, /lg/${src}`;
    const autoVideo = as === 'video' && auto;
    return (<div className={cn('fui-media', className)} style={Object.assign(Object.assign({}, style), (cover ? coverOuterStyle : defaultOuterStyle))} {...props}>
      {placeholder !== null && placeholder !== void 0 ? placeholder : <div className='fui-placeholder' style={placeholderStyle}/>}
      <Cond hide={!src} as={as} src={(!responsive && priority) ? src : undefined} data-lazy-src={(!responsive && !priority) ? src : undefined} srcSet={(responsive && priority) ? srcset : undefined} data-lazy-srcset={(responsive && !priority) ? srcset : undefined} sizes={responsive ? '100vw' : undefined} className={innerClass} allowFullScreen={as === 'iframe'} title={as === 'iframe' ? alt : undefined} alt={alt} style={typeof as === 'string' ? defaultMediaStyle(as) : undefined} autoPlay={autoVideo} muted={autoVideo} loop={autoVideo} playsInline={autoVideo}/>
    </div>);
}
const defaultOuterStyle = {
    overflow: 'hidden',
    position: 'relative',
    display: 'block',
    zIndex: '10',
};
const coverOuterStyle = {
    overflow: 'hidden',
    position: 'absolute',
    top: '0',
    bottom: '0',
    left: '0',
    right: '0',
};
const placeholderStyle = {
    position: 'absolute',
    top: '0',
    bottom: '0',
    left: '0',
    right: '0',
    backgroundImage: 'linear-gradient(to right, #e0e0e0, #c0c0c0)',
};
const defaultMediaStyle = (as) => ({
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    objectFit: as !== 'iframe' ? 'cover' : 'initial',
    objectPosition: as !== 'iframe' ? 'center' : 'initial',
});
//# sourceMappingURL=Media.jsx.map