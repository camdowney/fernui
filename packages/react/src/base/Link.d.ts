/// <reference types="react" />
interface Props {
    as?: any;
    to?: string;
    text?: string;
    icon?: {
        children: string;
    };
    iconClass?: string;
    blank?: boolean;
    label?: string;
    children?: any;
    [x: string]: any;
}
export default function Link({ as, to, text, icon, iconClass, blank, label, children, ...props }: Props): JSX.Element;
export {};
