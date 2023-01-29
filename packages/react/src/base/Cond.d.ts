/// <reference types="react" />
interface Props {
    innerRef?: any;
    as?: any;
    hide?: boolean;
    children?: any;
    [x: string]: any;
}
export default function Cond({ innerRef, as, hide, children, ...props }: Props): JSX.Element;
export {};
