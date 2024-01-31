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

    return (<aside
            className="fixed inset-y-0 flex flex-col items-center justify-between overflow-y-auto bg-gray-300 py-3 duration-200 left-[-300px] mt-[70px] w-[60px] md:left-0">
            <ul className="mt-1 flex w-full flex-col items-center gap-y-3">
                {linkList.map(item => <Link to={item.link} key={item.link}>
                    {location.pathname == item.link ?
                        <li className="flex cursor-pointer items-center justify-center rounded-lg bg-blue-500 text-gray-100 duration-300 w-[60px] h-[60px]">
                            <item.solidIcon className="text-5xl"/>
                        </li> :
                        <li className="flex cursor-pointer items-center justify-center rounded-lg bg-gray-300 text-blue-500 duration-300 w-[60px] h-[60px] hover:bg-blue-400 hover:text-gray-100">
                            <item.icon className="text-5xl"/>
                        </li>}
                </Link>)}
            </ul>
        </aside>
    );
};