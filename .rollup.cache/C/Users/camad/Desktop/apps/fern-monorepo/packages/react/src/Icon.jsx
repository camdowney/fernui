import { __rest } from "tslib";
import React from 'react';
export default function Icon(_a) {
    var { i } = _a, props = __rest(_a, ["i"]);
    const { children } = i, rest = __rest(i, ["children"]);
    return (<svg style={Object.assign({}, iconStyle)} dangerouslySetInnerHTML={{ __html: children }} {...rest} {...props}/>);
}
const iconStyle = {
    flexShrink: '0',
    fill: 'currentcolor',
};
//# sourceMappingURL=Icon.jsx.map