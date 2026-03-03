  import { Outlet } from 'react-router-dom';
  import Header from './Header';
  import Sidebar from './Sidebar';
  import Footer from './Footer';

  // MainLayout is the wrapper for all authenticated pages
  // Outlet is where child routes will be rendered
  const MainLayout = () => {
    return (
      // min-h-screen = minimum height 100vh (full screen)
      // flex = display: flex
      // flex-col = flex direction column (stack vertically)
      <div className="min-h-screen flex flex-col">

        {/* Header at the top */}
        <Header />

        {/* flex = display: flex */}
        {/* flex-1 = flex: 1 (takes remaining space) */}
        <div className="flex flex-1">

          {/* Sidebar on the left */}
          <Sidebar />

          {/* Main content area */}
          {/* flex-1 = flex: 1 (takes remaining space) */}
          {/* p-6 = padding 1.5rem on all sides */}
          {/* bg-gray-50 = light gray background */}
          <main className="flex-1 min-w-0 p-6 bg-gray-50 overflow-auto">
            {/* Outlet renders the matched child route component */}
            <Outlet />
          </main>
        </div>

        {/* Footer at the bottom */}
        <Footer />
      </div>
    );
  };

  export default MainLayout;