/// <reference types="react" />
interface Props {
    html: string;
    [x: string]: any;
}
export default function Markup({ html, ...props }: Props): JSX.Element;
export {};
