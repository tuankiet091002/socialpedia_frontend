import {Link} from "react-router-dom";
import avatar from "@assets/Logomark.svg";
import emptyAvatar from "@assets/empty avatar.jpg";
import {NotificationList} from "@features/notification/components/NotificationList.tsx";
import storage from "@utils/storage.ts";
import {IoIosArrowDown} from "react-icons/io";
import {useState} from "react";

export const Header = () => {
    const user = storage.getUser();
    const [profileMenu, setProfileMenu] = useState<boolean>(false);

    return (<nav className="border-gray-200 bg-blue-500 px-4 shadow-2xl py-2.5 dark:bg-gray-800 lg:px-6">
        <div className="mx-auto flex flex-wrap items-center justify-between">
            <Link to="/" className="flex items-center">
                <img className="mr-3 h-10 w-10 rounded-full" src={avatar} alt="Rounded avatar"/>
                <div
                    className="self-center whitespace-nowrap text-2xl font-semibold text-white dark:text-white">Socialpedia
                </div>
            </Link>

            <div className="flex items-center gap-2">
                <NotificationList/>
                {user ? <section className="rounded-r-lg bg-blue-400 p-1 rounded-l-[25px] hover:bg-blue-300"
                                 onClick={() => setProfileMenu((profileMenu) => !profileMenu)}>
                        <img className="mr-3 inline-block h-10 w-10 rounded-full" src={user.avatar?.url} alt={emptyAvatar}/>
                        <span className="mr-1 font-semibold text-white">{user.name}</span>
                        <IoIosArrowDown className="inline text-xl text-white"/>
                        {profileMenu &&
                            <ul className="fixed right-8 z-40 rounded-md border border-gray-300 bg-white p-1 w-[150px] mt-[8px]">
                                <Link to="/user/profile">
                                    <li className="rounded-md hover:bg-blue-500 hover:text-white">Trang cá nhân
                                    </li>
                                </Link>
                                <Link to="/user/list">
                                    <li className="mt-1 rounded-md hover:bg-blue-500 hover:text-white">Đổi mật khẩu</li>
                                </Link>
                                <div className="w-full bg-gray-300 h-[1px]"></div>
                                <Link to="/auth/login" onClick={() => storage.clearAll()} className="mt-[10px]">
                                    <li className="mt-1 rounded-md text-red-600 hover:bg-red-500 hover:text-white">
                                        Đăng xuất
                                    </li>
                                </Link>
                            </ul>}
                    </section> :
                    <Link to="/auth/login">
                        <button
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium 
                            rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 
                            focus:outline-none dark:focus:ring-blue-800">
                            Login
                        </button>
                    </Link>}
                <button data-collapse-toggle="mobile-menu" type="button"
                        className="inline-flex items-center p-2 ml-1 text-sm text-white rounded-lg lg:hidden hover:bg-gray-100
                        focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        aria-controls="mobile-menu" aria-expanded="false">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd"
                              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                              clipRule="evenodd"></path>
                    </svg>
                    <svg className="hidden h-6 w-6" fill="currentColor" viewBox="0 0 20 20"
                         xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"></path>
                    </svg>
                </button>
            </div>

        </div>
    </nav>);
};