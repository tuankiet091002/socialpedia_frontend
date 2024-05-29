import {Link} from "react-router-dom";
import avatar from "@assets/Logomark.svg";
import storage from "@utils/storage.ts";
import {IoIosArrowDown, IoIosNotificationsOutline} from "react-icons/io";
import {NotificationList} from "@features/notification/components/NotificationList.tsx";
import {Button} from "@components/elements/Button.tsx";
import {Avatar} from "@components/elements/Avatar.tsx";
import {useDisclosure} from "@src/hooks/useDisclosure.ts";
import {useState} from "react";
import {useGetOwnerQuery} from "@features/auth/api.ts";
import {NotificationQueryRequest} from "@features/notification/types/NotificationQueryRequest.ts";
import {useGetNotificationListQuery} from "@features/notification/api.ts";
import {NotificationType} from "@src/types.ts";

const INITIAL_PAGE = 6;

export const Header = () => {
    // somehow break if use useAuth
    const {data: user} = useGetOwnerQuery(null);
    const initialState = {pageNo: 0, pageSize: INITIAL_PAGE};
    const [query, setQuery] = useState<NotificationQueryRequest>(initialState);

    const {isOpen: profileMenu, toggle: toggleProfileMenu} = useDisclosure();
    const {isOpen: notification, toggle: toggleNotification} = useDisclosure();

    // notification data
    const {data} = useGetNotificationListQuery(query);

    // wait for next render when there is data
    if (!!user && !data) return null;

    return (
        <nav
            className="flex flex-wrap items-center justify-between gap-2 bg-blue-500 px-4 py-2.5 min-h-[70px]">

            {/* website icon */}
            <Link to="/" className="flex items-center gap-x-3">
                <Avatar className="!w-10 !h-10" src={avatar}/>
                <p className="whitespace-nowrap text-2xl font-semibold text-white">Socialpedia</p>
            </Link>

            {/* user button*/}
            <section className="flex items-center gap-2">
                {user ?
                    // user button group
                    <div className="relative flex flex-row gap-x-4">
                        <div
                            className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-400 p-1 hover:bg-blue-300"
                            onClick={toggleNotification}>
                            <IoIosNotificationsOutline className="cursor-pointer text-4xl font-bold text-white"/>
                            {/* red dot when there's unseen notification*/}
                            {data && data.content.some(m => m.type != NotificationType.DONE) && <div
                                className="absolute bottom-0 rounded-full bg-red-500 w-[12px] h-[12px] left-[35px]"/>}
                        </div>
                        {notification && data && <NotificationList data={data} setQuery={setQuery}/>}
                        <div
                            className="cursor-pointer whitespace-nowrap rounded-r-lg bg-blue-400 p-1 rounded-l-[25px] space-x-2 hover:bg-blue-300"
                            onClick={toggleProfileMenu}>
                            <Avatar size="sm" className="inline-block !w-10 !h-10" src={user.avatar?.url}/>
                            <span className="font-semibold text-white">{user.name}</span>
                            <IoIosArrowDown className="inline text-xl text-white"/>
                            {profileMenu &&
                                <ul className="absolute right-8 z-40 rounded-md border border-gray-300 bg-white p-1 w-[150px] bottom-[-90px] space-y-1">
                                    <Link to="/user/profile">
                                        <li className="rounded-md hover:bg-blue-500 hover:text-white">Profile page
                                        </li>
                                    </Link>
                                    <Link to="/user/password">
                                        <li className="mt-1 rounded-md hover:bg-blue-500 hover:text-white">
                                            Change password
                                        </li>
                                    </Link>
                                    <hr className="w-full bg-gray-300 h-[1px] !mb-1"/>
                                    <Link to="/auth/login" onClick={() => storage.clearAll()} className="mt-[10px]">
                                        <li className="rounded-md text-red-600 hover:bg-red-500 hover:text-white">
                                            Logout
                                        </li>
                                    </Link>
                                </ul>}
                        </div>
                    </div> :

                    // go to login
                    <Link to="/auth/login">
                        <Button type="button">
                            Login
                        </Button>
                    </Link>}

            </section>

        </nav>
    );
};