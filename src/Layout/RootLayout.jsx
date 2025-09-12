import React from 'react';
import MainNav from '../components/MainNav';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';
import useDocumentStore from '../store/document-store'; // 1. Import store
import LoadingOverlay from '../components/LoadingOverlay'; // 2. Import LoadingOverlay

const RootLayout = () => {
  // 3. ดึงค่า isLoading จาก store
  const isLoading = useDocumentStore((state) => state.isLoading);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 4. ถ้า isLoading เป็น true ให้แสดง LoadingOverlay */}
      {isLoading && <LoadingOverlay />}
      
      <MainNav />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;