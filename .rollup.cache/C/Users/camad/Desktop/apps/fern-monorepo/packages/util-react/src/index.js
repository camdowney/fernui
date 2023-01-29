import { useEffect } from 'react';
export * from '../../util/src/index.js';
export const useListener = (event, callback, element, passive = true) => {
    useEffect(() => {
        const current = (element === null || element === void 0 ? void 0 : element.current) || element || window;
        current.addEventListener(event, callback, { passive });
        return () => current.removeEventListener(event, callback, { passive });
    }, [event, callback]);
};
//# sourceMappingURL=index.js.map