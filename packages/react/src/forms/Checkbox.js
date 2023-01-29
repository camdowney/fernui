import React, { useState, useRef } from 'react';
import { Info, Icon, Cond } from '..';
import { cn, useListener } from '../util';
import { check } from '../icons';
export default function Checkbox({ innerRef, id, name, label, className, required, onChange, message }) {
    const [invalid, setInvalid] = useState(required);
    const [modified, setModified] = useState(false);
    const [formState, setFormState] = useState({});
    const outerRef = useRef();
    const showInfo = invalid && (modified || formState.error);
    const update = (e) => {
        setInvalid(required && !e.target.checked);
        setModified(true);
    };
    useListener('FernFormStateChange', (e) => {
        setFormState(e.detail.state);
    }, outerRef);
    return (React.createElement("div", { ref: outerRef, className: cn('fui-field', showInfo && 'fui-field-invalid', className) },
        React.createElement("label", { style: wrapperStyle },
            React.createElement("input", { ref: innerRef, id: id, type: 'checkbox', name: name || label, "data-field-valid": !invalid, onChange: e => { update(e), onChange && onChange(e); }, onBlur: update, disabled: formState.disabled, style: inputStyle }),
            React.createElement("div", { className: 'fui-check-box', style: boxStyle },
                React.createElement(Icon, { i: check, className: 'fui-check-icon', style: iconStyle })),
            React.createElement(Cond, { hide: !label, className: 'fui-label' }, label)),
        React.createElement(Info, { visible: showInfo }, message || 'Please check this box to proceed.')));
}
const wrapperStyle = {
    display: 'flex',
    cursor: 'pointer',
};
const inputStyle = {
    width: '0',
    height: '0',
    outlineWidth: '0 !important',
};
const boxStyle = {
    flexShrink: '0',
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
};
const iconStyle = {
    position: 'relative',
    display: 'block',
};
