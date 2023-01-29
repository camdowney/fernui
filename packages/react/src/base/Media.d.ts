/// <reference types="react" />
interface Props {
    as?: string;
    src?: string;
    className?: string;
    style?: object;
    innerClass?: string;
    alt?: string;
    placeholder?: any;
    cover?: boolean;
    auto?: boolean;
    priority?: boolean;
    [x: string]: any;
}
export default function Media({ as, src, className, style, innerClass, alt, placeholder, cover, auto, priority, ...props }: Props): JSX.Element;
export {};
