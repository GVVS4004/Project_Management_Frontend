import React from "react";
import { Link, useNavigate } from "react-router-dom";

import { useLogout } from '../../hooks/useAuth';
import NotificationBell from "../../features/notifications/components/NotificationBell";
import Avatar from "../Avatar";
import { userService } from "../../services/auth.service";
import Tooltip from "../ToolTip";

const Header = () => {
  const useLogoutMutation = useLogout();
  const user = userService.getUser();
  const handleLogout = () => {
    useLogoutMutation.mutate();
  }
  const navigate = useNavigate();
  const handleProfile = () => {
    // Navigate to profile page
    navigate("/profile");
  }
  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-blue-600">
              Task Manager
            </Link>
          </div>
          {/* Navigation Links */}
          {/* hidden = display: none (hidden by default on mobile) */}
          {/* md:flex = on medium screens (768px+), display: flex */}
          {/* space-x-8 = horizontal gap of 2rem between child elements */}
          <nav className="hidden md:flex space-x-8">
            {/* text-gray-700 = gray text color (shade 700) */}
            {/* hover:text-blue-600 = on hover, change text to blue */}
            <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
              Dashboard
            </Link>
            <Link to="/projects" className="text-gray-700 hover:text-blue-600">
              Projects
            </Link>
            <Link to="/tasks" className="text-gray-700 hover:text-blue-600">
              Tasks
            </Link>
          </nav>

          {/* User Menu Section */}
          {/* flex = display: flex */}
          {/* items-center = vertically center items */}
          {/* space-x-4 = horizontal gap of 1rem between buttons */}
          <div className="flex items-center space-x-4">
            <NotificationBell />
            {/* <div title={`${user?.firstName} ${user?.lastName}`}> */}
                <Avatar src={user?.profileImageUrl?? ""} alt={user?.firstName + " " + user?.lastName || "User"} />                
            {/* </div> */}
                
            <button className="text-gray-700 hover:text-blue-600" onClick={handleProfile}>
              Profile
            </button>
            <button className="text-gray-700 hover:text-blue-600" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
