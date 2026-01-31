import { Link, useLocation } from "react-router-dom";

import React from 'react'

const Sidebar = () => {
    const location = useLocation();
    const navigation = [
        { name: 'Dashboard', path: '/dashboard', icon: '📊' },
        { name: 'Projects', path: '/projects', icon: '📁' },
        { name: 'Tasks', path: '/tasks', icon: '✓' },
        { name: 'Team', path: '/team', icon: '👥' },
        { name: 'Settings', path: '/settings', icon: '⚙️' },
    ]
    // Helper function to check if current route matches link
    const isActive = (path: string) => location.pathname === path;
    return (
        <aside className="w-64 bg-gray-50 border-r border-gray-200 min-h-screen">
            <nav className="p-4 space-y-2">
                {navigation.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        // Conditional classes using template literals
                        // flex = display: flex
                        // items-center = vertically center content
                        // space-x-3 = horizontal gap of 0.75rem between icon and text
                        // px-4 = padding left & right 1rem
                        // py-3 = padding top & bottom 0.75rem
                        // rounded-lg = large border radius (0.5rem)
                        // transition-colors = smooth color transition on hover
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive(item.path)
                            // Active state styles
                            // bg-blue-100 = light blue background
                            // text-blue-700 = blue text color
                            // font-medium = font weight 500
                            ? 'bg-blue-100 text-blue-700 font-medium'
                            // Inactive state styles
                            // text-gray-700 = gray text
                            // hover:bg-gray-100 = light gray background on hover
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        <span className="text-xl">{item.icon}</span>
                        <span className="font-medium">{item.name}</span>
                    </Link>
                ))}
            </nav>
        </aside>
    )
}


export default Sidebar
