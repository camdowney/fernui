/// <reference types="react" />
interface Props {
    innerRef?: any;
    id?: string;
    name: string;
    label?: string;
    placeholder?: string;
    className?: string;
    options: string[];
    required?: boolean;
    onChange?: Function;
    message?: string;
}
export default function Select({ innerRef, id, name, label, placeholder, className, options, required, onChange, message }: Props): JSX.Element;
export {};
