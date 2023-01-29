/// <reference types="react" />
interface Props {
    as?: string;
    title?: string;
    desc?: string;
    image?: string;
    canonical?: string;
    noindex?: boolean;
    siteIcon?: string;
    touchIcon?: string;
    themeColor?: string;
    children?: any;
}
export default function Meta({ as, title, desc, image, canonical, noindex, siteIcon, touchIcon, themeColor, children }: Props): JSX.Element;
export {};
