import React, { useState, useRef } from 'react';
import { Icon, Modal, Form } from '..';
import { cn, openModal } from '../util';
import { warning } from '../icons';
export default function InteractForm({ children, btn, messages = [], ...props }) {
    const [formState, setFormState] = useState({});
    const modalRef = useRef();
    const message = messages[formState.id] || formState.message;
    const handleState = (state) => {
        setFormState(state);
        if (state.error || state.id === 6)
            openModal(modalRef);
    };
    return (React.createElement(Form, { onStateChange: handleState, ...props },
        children,
        !formState.end ? React.createElement(React.Fragment, null,
            btn,
            React.createElement(Modal, { innerRef: modalRef, className: cn('fui-interact-modal', `fui-${formState.error ? 'error' : 'info'}-modal`), bgClass: 'hidden', closeDelay: 2000, relative: true, exitOn: {}, style: { zIndex: '30 !important' } },
                React.createElement(Icon, { i: warning, className: 'fui-interact-icon' }),
                message)) : (React.createElement("p", { className: 'fui-interact-message' }, message))));
}
