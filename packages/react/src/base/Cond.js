import React from 'react';
export default function Cond({ innerRef, as = 'div', hide, children, ...props }) {
    const Shell = as;
    return hide ? React.createElement(React.Fragment, null) : (React.createElement(Shell, { ref: innerRef, ...props }, children));
}
