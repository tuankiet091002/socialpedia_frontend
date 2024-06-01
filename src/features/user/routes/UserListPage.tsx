import {Head} from "@components/elements/Head.tsx";
import {IoPeopleCircleOutline} from "react-icons/io5";
import {useAuth} from "@src/hooks/useAuth.ts";
import {FriendList} from "@features/user/components/FriendList.tsx";
import {UserList} from "@features/user/components/UserList.tsx";
import {UserFinder} from "@features/user/components/UserFinder.tsx";

export const UserListPage = () => {

    const {data: owner} = useAuth();

    return (<>
        <Head title="User List"/>
        <div className="min-h-full border border-gray-300 bg-gray-100 space-y-2">
            <section
                className="flex items-center gap-x-2 border-b border-gray-300 bg-gray-50 px-3 text-start text-3xl h-[50px]">
                <IoPeopleCircleOutline className="inline rounded-md bg-blue-500 text-white"/>
                <p className="inline-block align-text-top">
                    User List
                </p>
            </section>
            {owner && owner.role!.name == "admin" ?
                <section className="bg-gray-100 p-2">
                    <UserList/>
                </section> :
                <section
                    className="h-[calc(100vh-130px)] grid bg-gray-100 grid-cols-[1fr_2fr] divide-x-2 divide-gray-300">
                    <UserFinder/>
                    <FriendList/>
                </section>
            }
        </div>
    </>)
}