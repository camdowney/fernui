/// <reference types="react" />
interface Props {
    innerRef?: any;
    id?: string;
    name: string;
    label?: string;
    placeholder?: string;
    className?: string;
    type?: string;
    required?: boolean;
    charLimit?: number;
    onChange?: Function;
    message?: string;
}
export default function Input({ innerRef, id, name, label, placeholder, className, type, required, charLimit, onChange, message }: Props): JSX.Element;
export {};
