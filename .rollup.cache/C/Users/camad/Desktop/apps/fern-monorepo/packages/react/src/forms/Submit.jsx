import { __rest } from "tslib";
import React, { useState, useRef } from 'react';
import Link from '../Link';
import { useListener } from '../_util';
export default function Submit(_a) {
    var { text = 'Submit' } = _a, props = __rest(_a, ["text"]);
    const [formState, setFormState] = useState({});
    const ref = useRef();
    useListener('FernFormStateChange', (e) => {
        setFormState(e.detail.state);
    }, ref);
    return (<Link innerRef={ref} text={text} type='submit' disabled={formState.disabled} {...props}/>);
}
//# sourceMappingURL=Submit.jsx.map