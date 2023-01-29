import React, { useState } from 'react';
export default function Honeypot() {
    const [isValid, setIsValid] = useState(true);
    return (React.createElement("input", { name: 'fui-config-fax', type: 'checkbox', value: 1, onChange: e => setIsValid(!e.target.checked), "data-field-valid": isValid, autoComplete: 'off', tabIndex: -1, required: true, style: { display: 'none' } }));
}
