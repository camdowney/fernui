/// <reference types="react" />
interface Props {
    children?: any;
    btn?: any;
    messages?: string[];
    [x: string]: any;
}
export default function InteractForm({ children, btn, messages, ...props }: Props): JSX.Element;
export {};
