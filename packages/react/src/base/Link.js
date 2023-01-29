import React from 'react';
import { Cond, Icon } from '..';
export default function Link({ as, to, text, icon, iconClass, blank, label, children, ...props }) {
    return (React.createElement(Cond, { as: as || (to ? 'a' : 'button'), href: to, target: blank && '_blank', rel: blank && 'noopener noreferrer', "aria-label": label || text, ...props },
        React.createElement(Cond, { hide: !text, as: 'span' }, text),
        children,
        icon && React.createElement(Icon, { i: icon, className: iconClass })));
}
