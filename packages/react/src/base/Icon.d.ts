/// <reference types="react" />
interface Props {
    i: {
        children: string;
    };
    [x: string]: any;
}
export default function Icon({ i, ...props }: Props): JSX.Element;
export {};
