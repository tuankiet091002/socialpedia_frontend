import {RefObject} from "react";

export function setScrollspy<T extends HTMLElement>(listScrollRef: RefObject<T>, isDesc: boolean, callback: () => void) {

    const listScrollElement: T | null = listScrollRef.current;

    if (listScrollElement) {
        const onScroll = () => {
            const {scrollTop, scrollHeight, clientHeight} = listScrollElement;
            const isNearBorder = isDesc ? scrollTop + clientHeight >= scrollHeight
                : scrollTop == 0;

            if (isNearBorder) callback();
        };

        // add to listener
        listScrollElement.addEventListener("scroll", onScroll);
        // clean-up
        return () => {
            listScrollElement.removeEventListener("scroll", onScroll);
        };
    }
}