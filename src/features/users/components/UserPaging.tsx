import {Page} from "../../../types.ts";
import {UserQueryRequest, UserResponse} from "@features/users";
import React from "react";
import clsx from "clsx";

type UserPagingProps = {
    data: Page<UserResponse>,
    setQuery: React.Dispatch<React.SetStateAction<UserQueryRequest>>
}

export const UserPaging = ({data, setQuery}: UserPagingProps) => {

    const handleNavigate = (num: number) => {
        setQuery(query => ({...query, pageNo: num}))
    }

    const nthPage = (n: number) => {
        return (<li className="page-item" key={n}>
            <div className={clsx("page-link", n === data.number && "active")}
                 onClick={() => handleNavigate(n)}>{n + 1}</div>
        </li>)
    }

    let threeDotsKey = 0;

    const threeDots = () => {
        return (<li className="page-item" key={"..." + threeDotsKey++}>
            <div className="page-link">...</div>
        </li>)
    }

    // paging logic
    const elements = [];
    // if < 6 then display normally
    if (data.totalPages < 6) {
        for (let i = 0; i < data.totalPages; i++) {
            elements.push(nthPage(i));
        }
    } else {
        // Always print first page button
        elements.push(nthPage(0))

        // Print "..." only if currentPage is > 3
        if (data.number > 2) {
            elements.push(threeDots())
        }

        // special case where last page is selected...
        if (data.last) {
            elements.push(nthPage(data.number - 2));
        }

        // Print previous number button if currentPage > 2
        if (data.number > 1) {
            elements.push(nthPage(data.number - 1));
        }

        // Print current page number button as long as it not the first or last page
        if (data.number != 0 && !data.last) {
            elements.push(nthPage(data.number));
        }

        //print next number button if currentPage < lastPage - 1
        if (data.number < data.totalPages - 2) {
            elements.push(nthPage(data.number + 1));
        }

        // special case where first page is selected...
        if (data.first) {
            elements.push(nthPage(data.number + 2));
        }

        // print "..." if currentPage is < lastPage -2
        if (data.number < data.totalPages - 3) {
            elements.push(threeDots());
        }

        // always print last page button if there is more than 1 page
        elements.push(nthPage(data.totalPages - 1));
    }


    return (<nav aria-label="Page navigation example">
        <ul className="pagination justify-content-center">
            {elements}
        </ul>
    </nav>)
}
