import {Link, useLocation} from "react-router-dom";
import {
    IoChatboxEllipses,
    IoChatboxEllipsesOutline,
    IoList,
    IoListOutline,
    IoPeopleCircle,
    IoPeopleCircleOutline
} from "react-icons/io5";
import {HiOutlineUserGroup, HiUserGroup} from "react-icons/hi";

const linkList = [
    {link: "/user/list", icon: IoPeopleCircleOutline, solidIcon: IoPeopleCircle},
    {link: "/channel/list", icon: IoListOutline, solidIcon: IoList},
    {link: "/inbox", icon: IoChatboxEllipsesOutline, solidIcon: IoChatboxEllipses},
    {link: "/channel", icon: HiOutlineUserGroup, solidIcon: HiUserGroup}
];

export const Sidebar = () => {
    const location = useLocation();

    return (<nav
            className="fixed top-0 flex h-screen flex-col items-center justify-between overflow-y-auto bg-white py-3 shadow duration-200 left-[-300px] mt-[68px] w-[60px] md:left-0"
            id="mobile-menu">
            <ul className="mt-1 flex w-full flex-col items-center gap-y-3">
                {linkList.map(item => <Link to={item.link} key={item.link}>
                    {location.pathname == item.link ?
                        <li className="flex cursor-pointer items-center justify-center rounded-lg bg-blue-500 text-white 
                        duration-300 w-[60px] h-[60px]">
                            <item.solidIcon className="text-5xl"/>
                        </li> :
                        <li className="flex cursor-pointer items-center justify-center rounded-lg bg-white text-blue-500 
                        duration-300 w-[60px] h-[60px] hover:bg-blue-400 hover:text-white">
                            <item.solidIcon className="text-5xl"/>
                        </li>}
                </Link>)}
            </ul>
        </nav>
    );
};