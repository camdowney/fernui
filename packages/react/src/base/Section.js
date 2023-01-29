import React from 'react';
import { Cond } from '..';
import { cn } from '../util';
export default function Section({ as = 'section', id, className, containerClass, bg, children }) {
    return (React.createElement(Cond, { as: as, id: id, className: cn('fui-section', className) },
        bg,
        React.createElement("div", { className: cn('fui-container', containerClass) }, children)));
}
