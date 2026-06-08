import { useEffect, useState } from 'react';
import { Breakpoints } from '../constants';

/**
 * Хук возвращает true, если ширина экрана не превышает заданный брейкпоинт.
 * По умолчанию используется Breakpoints.Mobile (720px) — он же используется
 * в стилях для скрытия .auth-header.
 *
 * @param {number} [breakpoint=Breakpoints.Mobile] - максимальная ширина в px
 * @returns {boolean}
 */
const useIsMobile = (breakpoint = Breakpoints.Mobile) => {
    const getMatch = () =>
        typeof window !== 'undefined' && window.matchMedia
            ? window.matchMedia(`(max-width: ${breakpoint}px)`).matches
            : false;

    const [isMobile, setIsMobile] = useState(getMatch);

    useEffect(() => {
        if (typeof window === 'undefined' || !window.matchMedia) return;

        const mql = window.matchMedia(`(max-width: ${breakpoint}px)`);
        const handler = (e) => setIsMobile(e.matches);

        if (mql.addEventListener) {
            mql.addEventListener('change', handler);
        } else {
            mql.addListener(handler);
        }

        setIsMobile(mql.matches);

        return () => {
            if (mql.removeEventListener) {
                mql.removeEventListener('change', handler);
            } else {
                mql.removeListener(handler);
            }
        };
    }, [breakpoint]);

    return isMobile;
};

export default useIsMobile;
