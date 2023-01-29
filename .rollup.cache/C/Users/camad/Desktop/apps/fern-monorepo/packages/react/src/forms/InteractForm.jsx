import { __rest } from "tslib";
import React, { useState, useRef } from 'react';
import Form from './Form';
import Modal from '../Modal';
import Icon from '../Icon';
import { cn, openModal } from '../_util';
import { warning } from '../_icons';
export default function InteractForm(_a) {
    var { children, btn, messages = [] } = _a, props = __rest(_a, ["children", "btn", "messages"]);
    const [formState, setFormState] = useState({});
    const modalRef = useRef();
    const message = messages[formState.id] || formState.message;
    const handleState = (state) => {
        setFormState(state);
        if (state.error || state.id === 6)
            openModal(modalRef);
    };
    return (<Form onStateChange={handleState} {...props}>
      {children}
      {!formState.end ? <>
        {btn}
        <Modal innerRef={modalRef} className={cn('fui-interact-modal', `fui-${formState.error ? 'error' : 'info'}-modal`)} bgClass='hidden' closeDelay={2000} relative exitOn={{}} style={{ zIndex: '30 !important' }}>
          <Icon i={warning} className='fui-interact-icon'/>
          {message}
        </Modal>
        
      </> : (<p className='fui-interact-message'>
          {message}
        </p>)}
    </Form>);
}
//# sourceMappingURL=InteractForm.jsx.map