import { __rest } from "tslib";
import React from 'react';
import Cond from './Cond';
import Icon from './Icon';
export default function Link(_a) {
    var { as, to, text, icon, iconClass, blank, label, children } = _a, props = __rest(_a, ["as", "to", "text", "icon", "iconClass", "blank", "label", "children"]);
    return (<Cond as={as || (to ? 'a' : 'button')} href={to} target={blank && '_blank'} rel={blank && 'noopener noreferrer'} aria-label={label || text} {...props}>
      <Cond hide={!text} as='span'>
        {text}
      </Cond>
      {children}
      {icon && <Icon i={icon} className={iconClass}/>}
    </Cond>);
}
//# sourceMappingURL=Link.jsx.map