/// <reference types="react" />
interface Props {
    text?: string;
    [x: string]: any;
}
export default function Submit({ text, ...props }: Props): JSX.Element;
export {};
