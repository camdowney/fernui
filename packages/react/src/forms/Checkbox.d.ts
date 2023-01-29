/// <reference types="react" />
interface Props {
    innerRef?: any;
    id?: string;
    name: string;
    label?: string;
    className?: string;
    required?: boolean;
    onChange?: Function;
    message?: string;
}
export default function Checkbox({ innerRef, id, name, label, className, required, onChange, message }: Props): JSX.Element;
export {};
