import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import store from './store.jsx';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: 'builder',
                lazy: () => import('./pages/WebsiteBuilder')
            },
            {
                path: 'schedule',
                lazy: () => import('./pages/Scheduling')
            },
            {
                path: 'clients',
                lazy: () => import('./pages/ClientManagement')
            },
            {
                path: 'staff',
                lazy: () => import('./pages/StaffManagement')
            },
            {
                path: 'analytics',
                lazy: () => import('./pages/Analytics')
            },
            {
                path: 'settings',
                lazy: () => import('./pages/Settings')
            }
        ]
    }
]);

const root = createRoot(document.getElementById('root'));

root.render(
    <Provider store={store}>
        <ChakraProvider>
            <ColorModeScript initialColorMode="light" />
            <AuthProvider>
                <ThemeProvider>
                    <RouterProvider router={router} />
                    <ToastContainer
                        position="bottom-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop
                        closeOnClick
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="colored"
                    />
                </ThemeProvider>
            </AuthProvider>
        </ChakraProvider>
    </Provider>
);
