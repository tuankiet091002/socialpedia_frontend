import {RefObject} from "react";

export function setScrollspy<T extends HTMLElement>(listScrollRef: RefObject<T>, isDesc: boolean, callback: () => void) {

    const listScrollElement: T | null = listScrollRef.current;

    if (listScrollElement) {
        // scroll to bottom of the page on render
        if (!isDesc) {
            listScrollElement.scrollTo(0, listScrollElement.scrollHeight);
        }

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