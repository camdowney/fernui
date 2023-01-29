/// <reference types="react" />
interface Props {
    title?: any;
    src?: any;
    [x: string]: any;
}
export default function Avatar({ title, src, ...props }: Props): JSX.Element;
export {};
