import {UserList} from "@features/user/components/UserList.tsx";
import {Head} from "@components/elements/Head.tsx";
import {IoPeopleCircleOutline} from "react-icons/io5";

export const UserListPage = () => {

    return (<>
        <Head title="User List"/>
        <div className="min-h-full border border-gray-300 bg-gray-100 space-y-2">
            <section
                className="flex items-center gap-x-2 border-b border-gray-300 bg-gray-50 px-3 text-start text-3xl h-[50px]">
                <IoPeopleCircleOutline className="inline rounded-md bg-blue-500 text-white"/>
                <p className="inline-block align-text-top">User List</p>
            </section>
            <section className="bg-gray-100 p-2">
                <UserList/>
            </section>

        </div>
    </>)
}