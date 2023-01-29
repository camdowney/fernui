import { __rest } from "tslib";
import React from 'react';
import Cond from './Cond';
export default function Markup(_a) {
    var { html } = _a, props = __rest(_a, ["html"]);
    return (<Cond dangerouslySetInnerHTML={{ __html: html }} {...props}/>);
}
//# sourceMappingURL=Markup.jsx.map