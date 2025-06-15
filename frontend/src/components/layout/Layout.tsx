import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Contenido principal con footer */}
        <div className="flex-1 flex flex-col overflow-auto">
          <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </main>
          
          {/* Footer */}
          <Footer className="mt-auto" />
        </div>
      </div>
    </div>
  );
};

export default Layout;
