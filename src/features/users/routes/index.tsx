import {useRoutes} from "react-router-dom";
import {Users} from "@features/users/routes/Users.tsx";

export const UsersRoutes = () => {

    return useRoutes([
            {path: '', element: <Users/>},
            {path: "*", element: <div>Wrong site</div>}
        ]
    )
}