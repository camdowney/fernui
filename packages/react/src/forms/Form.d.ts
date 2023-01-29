/// <reference types="react" />
interface Props {
    className?: string;
    children?: any;
    states?: Object[];
    onStateChange?: Function;
    onSubmit?: Function;
    maxAttempts?: number;
    maxSubmissions?: number;
}
export default function Form({ className, children, states, onStateChange, onSubmit, maxAttempts, maxSubmissions, }: Props): JSX.Element;
export {};
