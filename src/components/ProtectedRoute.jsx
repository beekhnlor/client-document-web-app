import React from 'react';
import { Navigate } from 'react-router-dom';
import useDocumentStore from '../store/document-store';

const ProtectedRoute = ({ children }) => {
    const token = useDocumentStore((state) => state.token); 

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;