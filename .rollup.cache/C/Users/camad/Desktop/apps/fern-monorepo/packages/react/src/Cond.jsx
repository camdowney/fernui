import { __rest } from "tslib";
import React from 'react';
export default function Cond(_a) {
    var { innerRef, as = 'div', hide, children } = _a, props = __rest(_a, ["innerRef", "as", "hide", "children"]);
    const Shell = as;
    return !hide ? (<Shell ref={innerRef} {...props}>
      {children}
    </Shell>) : (<></>);
}
//# sourceMappingURL=Cond.jsx.map