import React from 'react';
import { Cond, Icon } from '..';
import { warning } from '../icons';
export default function Info({ visible, children }) {
    return (React.createElement(Cond, { hide: !visible, className: 'fui-info', style: infoStyle },
        React.createElement(Icon, { i: warning, className: 'fui-info-icon' }),
        children));
}
const infoStyle = {
    display: 'inline-flex',
    alignItems: 'center',
};
