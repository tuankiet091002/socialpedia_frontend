import {Link} from "react-router-dom";
import avatar from "@assets/Logomark.svg";
import storage from "@utils/storage.ts";
import {IoIosArrowDown, IoIosNotificationsOutline} from "react-icons/io";
import {NotificationList} from "@features/notification/components/NotificationList.tsx";
import {useAuth} from "@src/hooks/useAuth.ts";
import {Button} from "@components/elements/Button.tsx";
import {Avatar} from "@components/elements/Avatar.tsx";
import {useDisclosure} from "@src/hooks/useDisclosure.ts";

export const Header = () => {
    const {user} = useAuth();
    const {isOpen: profileMenu, toggle: toggleProfileMenu} = useDisclosure();
    const {isOpen: notification, toggle: toggleNotification} = useDisclosure();

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
                        </div>
                        {notification && <NotificationList/>}
                        <div
                            className="cursor-pointer whitespace-nowrap rounded-r-lg bg-blue-400 p-1 rounded-l-[25px] space-x-2 hover:bg-blue-300"
                            onClick={toggleProfileMenu}>
                            <Avatar size="sm" className="inline-block !w-10 !h-10" src={user.avatar?.url}/>
                            <span className="font-semibold text-white">{user.name}</span>
                            <IoIosArrowDown className="inline text-xl text-white"/>
                            {profileMenu &&
                                <ul className="absolute right-8 z-40 rounded-md border border-gray-300 bg-white p-1 w-[150px] bottom-[-90px] space-y-1">
                                    <Link to="/user/profile">
                                        <li className="rounded-md hover:bg-blue-500 hover:text-white">Trang cá nhân
                                        </li>
                                    </Link>
                                    <Link to="/user/list">
                                        <li className="mt-1 rounded-md hover:bg-blue-500 hover:text-white">
                                            Đổi mật khẩu
                                        </li>
                                    </Link>
                                    <hr className="w-full bg-gray-300 h-[1px] !mb-1"/>
                                    <Link to="/auth/login" onClick={() => storage.clearAll()} className="mt-[10px]">
                                        <li className="rounded-md text-red-600 hover:bg-red-500 hover:text-white">
                                            Đăng xuất
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

                {/* responsive button */}
                {/*<button data-collapse-toggle="mobile-menu" type="button"*/}
                {/*        className="inline-flex items-center p-2 ml-1 text-sm text-white rounded-lg lg:hidden hover:bg-gray-100*/}
                {/*        focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"*/}
                {/*        aria-controls="mobile-menu" aria-expanded="false">*/}
                {/*    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">*/}
                {/*        <path fillRule="evenodd"*/}
                {/*              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"*/}
                {/*              clipRule="evenodd"></path>*/}
                {/*    </svg>*/}
                {/*    <svg className="hidden h-6 w-6" fill="currentColor" viewBox="0 0 20 20"*/}
                {/*         xmlns="http://www.w3.org/2000/svg">*/}
                {/*        <path fillRule="evenodd"*/}
                {/*              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"*/}
                {/*              clipRule="evenodd"></path>*/}
                {/*    </svg>*/}
                {/*</button>*/}
            </section>

        </nav>
    );
};