import React from 'react';
import { Cond } from '..';
import { cn } from '../util';
export default function Content({ id, className, head, headClass, children, bodyClass, }) {
    return (React.createElement("div", { id: id, className: cn('fui-content', className) },
        React.createElement(Cond, { hide: !head, className: cn('fui-head', headClass) }, head),
        React.createElement(Cond, { hide: !children, className: cn('fui-body', bodyClass) }, children)));
}
