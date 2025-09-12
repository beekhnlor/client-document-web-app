import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Layouts and Pages
import RootLayout from '../Layout/RootLayout';
import LayoutUser from '../Layout/LayoutUser'; 

import DashboardPage from '../pages/DashboardPage';
import DocumentsPage from '../pages/DocumentsPage'; 
import TaxForm from '../components/user/TaxForm'; 
import LaoApplicationForm from '../components/user/Form'; 
import Register from '../auth/register';
import Login from '../auth/Login';

// Auth
import ProtectedRoute from '../components/ProtectedRoute'; 

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            {
                path: "login",
                element: (
                    <div>
                        <div>
                            <Login />
                        </div>
                    </div>
                ),
            },
            {
                path: "register",
                element: (
                     <div >
                        <div>
                            <Register />
                        </div>
                    </div>
                ),
            },
            
          
            {
                
                element: (
                    <ProtectedRoute>
                        <LayoutUser />
                    </ProtectedRoute>
                ),
                children: [
                    {
                        index: true,
                        element: <DashboardPage /> 
                    },
                    {
                        path: "documents",
                        element: <DocumentsPage /> 
                    },
                    {
                        path: "document/view/:id",
                        element: <TaxForm />
                    },
                    {
                        path: "document/create",
                        element: <LaoApplicationForm />
                    },
                    {
                        path: "document/edit/:id",
                        element: <LaoApplicationForm />
                    },
                ]
            }
        ]
    }
]);

const AppRoutes = () => {
    return (
        <div>
            <RouterProvider router={router} />
        </div>
    )
}

export default AppRoutes;