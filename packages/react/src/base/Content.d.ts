/// <reference types="react" />
interface Props {
    id?: string;
    className?: string;
    head?: any;
    headClass?: string;
    children?: any;
    bodyClass?: string;
}
export default function Content({ id, className, head, headClass, children, bodyClass, }: Props): JSX.Element;
export {};
