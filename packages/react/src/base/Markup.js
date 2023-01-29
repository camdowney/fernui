import React from 'react';
import { Cond } from '..';
export default function Markup({ html, ...props }) {
    return (React.createElement(Cond, { dangerouslySetInnerHTML: { __html: html }, ...props }));
}
