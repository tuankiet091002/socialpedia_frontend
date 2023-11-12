import { namedImport } from '@utils/namedImport.ts';

const { AuthRoutes } = namedImport(() => import('@features/auth'), 'AuthRoutes');

export const publicRoutes = [
    {
        path: 'auth/*',
        element: <AuthRoutes />,
    },
];