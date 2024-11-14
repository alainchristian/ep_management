import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    ChevronDown, ChevronRight,
    Search, Bell, Menu, X,
    Users, BookOpen, Calendar,
    BarChart2, Settings, User,
    Home, LogOut
} from 'lucide-react';
import { selectUserRoles, selectUserPermissions, selectCurrentUser, logout } from '../../store/authSlice';

// ASYV Colors
const colors = {
    primary: '#2f4f4f', // Dark Green
    secondary: '#3cb371', // Medium Green
    accent: '#ff7f50', // Orange
    light: '#98fb98', // Light Green
    white: '#ffffff',
    textLight: '#e0ffff', // Light Cyan
};

// Navigation group item type
const NavGroup = ({ label, icon: Icon, children, isOpen, onToggle }) => (
    <div className="mb-2">
        <button
            onClick={onToggle}
            className="w-full flex items-center px-3 py-2 text-gray-100 hover:bg-[#3cb371] rounded-md transition-colors duration-200"
        >
            <Icon className="h-5 w-5 mr-2" />
            <span className="flex-1 text-left">{label}</span>
            {isOpen ? (
                <ChevronDown className="h-4 w-4" />
            ) : (
                <ChevronRight className="h-4 w-4" />
            )}
        </button>
        {isOpen && (
            <div className="ml-4 mt-1 space-y-1">
                {children}
            </div>
        )}
    </div>
);

// Navigation link item
const NavLink = ({ to, icon: Icon, children }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors duration-200 ${isActive
                ? 'bg-[#3cb371] text-white'
                : 'text-gray-100 hover:bg-[#3cb371]'
                }`}
        >
            <Icon className="h-4 w-4 mr-2" />
            <span>{children}</span>
        </Link>
    );
};

const MainLayout = ({ children }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
    const [openGroups, setOpenGroups] = useState(['dashboard']);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isSidebarProfileOpen, setIsSidebarProfileOpen] = useState(false);
    const userRoles = useSelector(selectUserRoles);
    const userPermissions = useSelector(selectUserPermissions);
    const currentUser = useSelector(selectCurrentUser);
    const profileMenuRef = useRef(null);
    const sidebarProfileRef = useRef(null);

    // Handle window resize for sidebar
    useEffect(() => {
        const handleResize = () => {
            setIsSidebarOpen(window.innerWidth >= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Handle click outside for profile menus
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsProfileMenuOpen(false);
            }
            if (sidebarProfileRef.current && !sidebarProfileRef.current.contains(event.target)) {
                setIsSidebarProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleGroup = (group) => {
        setOpenGroups(prev =>
            prev.includes(group)
                ? prev.filter(g => g !== group)
                : [...prev, group]
        );
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 bg-[#2f4f4f] w-64 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } md:translate-x-0 z-30`}>
                {/* Logo */}
                <div className="h-16 flex items-center px-4 bg-[#2f4f4f]">
                    <span className="text-white text-xl font-bold">EP Management</span>
                </div>

                {/* Navigation */}
                {/* Navigation section in MainLayout.jsx */}
                <nav className="mt-4 px-2 space-y-1">
                    {/* Dashboard - Available to all users */}
                    <NavLink to="/dashboard" icon={Home}>
                        Dashboard
                    </NavLink>

                    {/* Student Management - For admin, teacher, supervisor */}
                    {(userPermissions.includes('manage_students') || userRoles.includes('admin')) && (
                        <NavGroup
                            label="Students"
                            icon={Users}
                            isOpen={openGroups.includes('students')}
                            onToggle={() => toggleGroup('students')}
                        >
                            <NavLink to="/students/list" icon={Users}>All Students</NavLink>
                            <NavLink to="/students/registration" icon={Users}>Registration</NavLink>
                            <NavLink to="/families" icon={Users}>Family Groups</NavLink>
                            <NavLink to="/students/import" icon={Users}>Import Students</NavLink>
                        </NavGroup>
                    )}

                    {/* EP Management - For admin, teacher */}
                    {(userPermissions.includes('manage_eps') || userRoles.includes('admin')) && (
                        <NavGroup
                            label="Enrichment Programs"
                            icon={BookOpen}
                            isOpen={openGroups.includes('eps')}
                            onToggle={() => toggleGroup('eps')}
                        >
                            {/* Sports Center */}
                            <NavLink to="/eps/sports/football" icon={BookOpen}>Football</NavLink>
                            <NavLink to="/eps/sports/basketball" icon={BookOpen}>Basketball</NavLink>
                            <NavLink to="/eps/sports/volleyball" icon={BookOpen}>Volleyball</NavLink>
                            <NavLink to="/eps/sports/karate" icon={BookOpen}>Karate</NavLink>

                            {/* Arts Center */}
                            <NavLink to="/eps/arts/sewing" icon={BookOpen}>Sewing</NavLink>
                            <NavLink to="/eps/arts/piano" icon={BookOpen}>Piano</NavLink>
                            <NavLink to="/eps/arts/guitar" icon={BookOpen}>Guitar</NavLink>
                            <NavLink to="/eps/arts/recording" icon={BookOpen}>Recording</NavLink>
                            <NavLink to="/eps/arts/visual-arts" icon={BookOpen}>Visual Arts</NavLink>
                            <NavLink to="/eps/arts/media" icon={BookOpen}>Media</NavLink>

                            {/* Science Center */}
                            <NavLink to="/eps/science/mechanics" icon={BookOpen}>Mechanics</NavLink>
                            <NavLink to="/eps/science/design" icon={BookOpen}>Design</NavLink>
                            <NavLink to="/eps/science/electronics" icon={BookOpen}>Electronics</NavLink>
                        </NavGroup>
                    )}

                    {/* Attendance Management - For admin, teacher, attendance taker */}
                    {(userPermissions.includes('take_attendance') || userRoles.includes('admin')) && (
                        <NavGroup
                            label="Attendance"
                            icon={Calendar}
                            isOpen={openGroups.includes('attendance')}
                            onToggle={() => toggleGroup('attendance')}
                        >
                            <NavLink to="/attendance/take" icon={Calendar}>Take Attendance</NavLink>
                            <NavLink to="/attendance/history" icon={Calendar}>View History</NavLink>
                            <NavLink to="/attendance/reports" icon={Calendar}>Reports</NavLink>
                            <NavLink to="/attendance/absences" icon={Calendar}>Manage Absences</NavLink>
                        </NavGroup>
                    )}

                    {/* Reports - For admin, supervisor */}
                    {(userPermissions.includes('view_reports') || userRoles.includes('admin')) && (
                        <NavGroup
                            label="Reports"
                            icon={BarChart2}
                            isOpen={openGroups.includes('reports')}
                            onToggle={() => toggleGroup('reports')}
                        >
                            <NavLink to="/reports/attendance" icon={BarChart2}>Attendance Analysis</NavLink>
                            <NavLink to="/reports/performance" icon={BarChart2}>Performance Metrics</NavLink>
                            <NavLink to="/reports/enrollment" icon={BarChart2}>EP Enrollment</NavLink>
                            <NavLink to="/reports/center" icon={BarChart2}>Center Reports</NavLink>
                            <NavLink to="/reports/custom" icon={BarChart2}>Custom Reports</NavLink>
                        </NavGroup>
                    )}

                    {/* Administration - Admin only */}
                    {/* Inside the Administration NavGroup in MainLayout.jsx */}
                    {userRoles.includes('admin') && (
                        <NavGroup
                            label="Administration"
                            icon={Settings}
                            isOpen={openGroups.includes('admin')}
                            onToggle={() => toggleGroup('admin')}
                        >
                            <NavLink to="/admin/users" icon={Users}>
                                User Management
                            </NavLink>
                            <NavLink to="/admin/roles" icon={Users}>
                                Roles & Permissions
                            </NavLink>
                            <NavLink to="/admin/centers" icon={Settings}>
                                Center Management
                            </NavLink>
                            <NavLink to="/admin/settings" icon={Settings}>
                                System Settings
                            </NavLink>
                            <NavLink to="/admin/audit-logs" icon={Settings}>
                                Audit Logs
                            </NavLink>
                        </NavGroup>
                    )}
                </nav>


                {/* Sidebar User Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4" ref={sidebarProfileRef}>
                    <button
                        onClick={() => setIsSidebarProfileOpen(!isSidebarProfileOpen)}
                        className="w-full flex items-center px-2 py-3 bg-[#3cb371] hover:bg-[#2f4f4f] rounded-lg transition-colors duration-200"
                    >
                        <div className="w-10 h-10 rounded-full bg-[#98fb98] flex items-center justify-center">
                            <User className="h-6 w-6 text-[#2f4f4f]" />
                        </div>
                        <div className="ml-3 flex-1 text-left">
                            <p className="text-sm font-medium text-white">{currentUser?.firstName} {currentUser?.lastName}</p>
                            <p className="text-xs text-gray-300">{userRoles[0]}</p>
                        </div>
                        <ChevronDown className="h-4 w-4 text-white" />
                    </button>

                    {isSidebarProfileOpen && (
                        <div className="absolute bottom-20 left-4 right-4 bg-white rounded-lg shadow-lg py-2">
                            <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                Your Profile
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                                Sign out
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className={`transition-margin duration-300 ${isSidebarOpen ? 'md:ml-64' : 'ml-0'
                }`}>
                {/* Top Navigation */}
                <div className="bg-white shadow-sm sticky top-0 z-20">
                    <div className="flex items-center justify-between h-16 px-4">
                        {/* Hamburger Menu */}
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="text-gray-500 hover:text-gray-700 md:hidden"
                        >
                            {isSidebarOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>

                        {/* Search */}
                        <div className="flex-1 max-w-2xl ml-4">
                            <div className="relative">
                                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3cb371]"
                                />
                            </div>
                        </div>

                        {/* Right Navigation */}
                        <div className="flex items-center space-x-6">
                            <button className="text-gray-500 hover:text-gray-700">
                                <Bell className="h-6 w-6" />
                            </button>

                            {/* Profile Menu */}
                            <div className="relative" ref={profileMenuRef}>
                                <button
                                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100"
                                >
                                    <div className="w-8 h-8 rounded-full bg-[#98fb98] flex items-center justify-center">
                                        <User className="h-5 w-5 text-[#2f4f4f]" />
                                    </div>
                                    <div className="hidden md:block text-left">
                                        <p className="text-sm font-medium text-gray-700">{currentUser?.firstName} {currentUser?.lastName}</p>
                                        <p className="text-xs text-gray-500">{userRoles[0]}</p>
                                    </div>
                                    <ChevronDown className="h-4 w-4 text-gray-500" />
                                </button>

                                {isProfileMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Your Profile
                                        </Link>
                                        <Link
                                            to="/settings"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Settings
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Overlay for mobile when sidebar is open */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Page Content */}
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;