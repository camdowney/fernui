import React, { useState, useRef } from 'react';
import { Link } from '..';
import { useListener } from '../util';
export default function Submit({ text = 'Submit', ...props }) {
    const [formState, setFormState] = useState({});
    const ref = useRef();
    useListener('FernFormStateChange', (e) => {
        setFormState(e.detail.state);
    }, ref);
    return (React.createElement(Link, { innerRef: ref, text: text, type: 'submit', disabled: formState.disabled, ...props }));
}
