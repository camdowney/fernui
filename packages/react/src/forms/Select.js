import React, { useState, useRef } from 'react';
import { Info, Icon, Cond } from '..';
import { cn, useListener } from '../util';
import { angle } from '../icons';
export default function Select({ innerRef, id, name, label, placeholder, className, options, required, onChange, message }) {
    const [invalid, setInvalid] = useState(required);
    const [modified, setModified] = useState(false);
    const [formState, setFormState] = useState({});
    const outerRef = useRef();
    const showInfo = invalid && (modified || formState.error);
    const update = (e) => {
        setInvalid(required && e.target.selectedIndex < 1);
        setModified(true);
    };
    useListener('FernFormStateChange', (e) => {
        setFormState(e.detail.state);
    }, outerRef);
    return (React.createElement("label", { ref: outerRef, className: cn('fui-field', showInfo && 'fui-field-invalid', className) },
        React.createElement(Cond, { hide: !label, className: 'fui-label' }, label),
        React.createElement("div", { style: { position: 'relative' } },
            React.createElement("select", { ref: innerRef, id: id, name: name || label || placeholder, "data-field-valid": !invalid, onChange: e => { update(e), onChange && onChange(e); }, onBlur: update, disabled: formState.disabled, style: { cursor: 'pointer' } },
                React.createElement("option", null, placeholder || 'Select an option'),
                options.map(o => React.createElement("option", { value: o, key: o }, o))),
            React.createElement("div", { style: wrapperStyle },
                React.createElement(Icon, { i: angle, className: 'fui-select-icon' }))),
        React.createElement(Info, { visible: showInfo }, message || 'Please select an option.')));
}
const wrapperStyle = {
    position: 'absolute',
    top: '0',
    right: '0',
    display: 'flex',
    height: '100%',
    alignItems: 'center',
};
