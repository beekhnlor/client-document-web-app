import React from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom"

import LayoutUser from '../Layout/LayoutUser'
import Home from '../pages/Home' 
import DocumentsPage from '../pages/DocumentsPage' 
import TaxForm from '../components/user/TaxForm' 
import LaoApplicationForm from '../components/user/Form' 
import DashboardPage from '../pages/DashboardPage'

const router = createBrowserRouter([
    {
        path: "/",
        element: <LayoutUser />,
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