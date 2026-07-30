import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react"
import useAuth from "../auth/useAuth";
import {
    LayoutDashboard,
    ClipboardList,
    Package,
    DollarSign,
    ShoppingCart,
    Box,
    CreditCard,
    Users,
    MessageSquare,
    Factory,
    BarChart3,
    Settings,
    HelpCircle,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    LogOut
} from "lucide-react";


const SideBar = ({ isMobileSidebarOpen, setIsMobileSidebarOpen }) => {


    const { handleLogout } = useAuth();
    const location = useLocation();

    const sidebarItems = [
        {
            name: "Dashboard",
            path: "/",
            icon: <LayoutDashboard className="w-5 h-5" />,
        },
        {
            name: "Lend",
            path: "/udhaar",
            icon: <ClipboardList className="w-5 h-5" />,
        },
        // {
        //     name: "Products",
        //     path: "/products",
        //     icon: <Package className="w-5 h-5" />,
        // },
        {
            name: "Sales",
            path: "/sales",
            icon: <DollarSign className="w-5 h-5" />,
        },
        {
            name: "Purchases",
            path: "/purchases",
            icon: <ShoppingCart className="w-5 h-5" />,
        },
        {
            name: "Inventory",
            path: "/inventory",
            icon: <Box className="w-5 h-5" />,
        },
        {
            name: "Finance",
            path: "/finance",
            icon: <CreditCard className="w-5 h-5" />,
        },
        {
            name: "Customers",
            path: "/customers",
            icon: <Users className="w-5 h-5" />
        },
        {
            name: "Billing",
            path: "/billing",
            icon: <Factory className="w-5 h-5" />,
        },
        {
            name: "Reports",
            path: "/reports",
            icon: <BarChart3 className="w-5 h-5" />,
        },
        {
            name: "Settings",
            path: "/settings",
            icon: <Settings className="w-5 h-5" />,
            hasDropdown: true,
        },
        {
            name: "Help & Support",
            path: "/help",
            icon: <HelpCircle className="w-5 h-5" />,
        },
    ];

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Keep sidebar closed on route change on mobile
    useEffect(() => {
        setIsMobileSidebarOpen(false);
    }, [location, setIsMobileSidebarOpen]);

    // Handle screen resize to detect mobile devices
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024); // lg breakpoint is 1024px
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // The sidebar displays collapsed only if we are on desktop, it's set to collapsed, and the user is not hovering
    const isCollapsed = !isMobile && isSidebarCollapsed && !isHovered;

    return <>
        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
            <div
                className="fixed inset-0 z-45 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
                onClick={() => setIsMobileSidebarOpen(false)}
            />
        )}

        {/* Left Sidebar */}
        <aside
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`fixed lg:relative inset-y-0 left-0 z-50 flex flex-col bg-[#0b1629] text-slate-300 border-r border-slate-800 shadow-xl transition-all duration-300 transform
                lg:translate-x-0 lg:h-screen
                ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                ${isCollapsed ? "w-20" : "w-64"}`}
        >
            {/* Brand Logo & Header */}
            <div className={`flex items-center px-5 py-5 border-b border-slate-800/80 ${isCollapsed ? "justify-center" : "justify-between"}`}>
                <div className={`flex items-center gap-3 transition-all duration-200 ${isCollapsed ? "justify-center" : ""}`}>
                    {/* Logo Avatar */}
                    <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-extrabold text-lg flex-shrink-0 shadow-md shadow-blue-500/20">
                        E
                    </div>
                    {!isCollapsed && (
                        <div className="flex flex-col">
                            <span className="font-bold text-white text-base leading-tight tracking-tight">ERP Suite</span>
                            <span className="text-[10px] text-slate-400 font-medium tracking-wide">Smart Business Solution</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Collapse Arrow Desktop - Sleek Floating Button on Border */}
            <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="hidden lg:flex absolute top-6 -right-1 z-50 items-center justify-center w-6 h-6 rounded-full bg-[#0b2029] hover:bg-slate-800 hover:text-slate-400  text-white border border-slate-700 shadow-md transition-all duration-200 hover:scale-110 cursor-pointer"
                title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
                {isSidebarCollapsed ? (
                    <ChevronRight className="w-3.5 h-3.5" strokeWidth={3} />
                ) : (
                    <ChevronLeft className="w-3.5 h-3.5" strokeWidth={3} />
                )}
            </button>

            {/* Scrollable Navigation Area */}
            <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1 scrollbar-none">
                {sidebarItems.map((item, idx) => {

                    // Highlight Inventory if currently in O2D
                    const isInventoryActive = item.name.includes("Inventory") && location.pathname === "/O2D";
                    const isItemActive = (location.pathname === item.path) || isInventoryActive;

                    return (
                        <NavLink
                            key={idx}
                            to={item.path}
                            onClick={(e) => {
                                if (item.path === "/settings") {
                                    e.preventDefault();
                                    alert(`Please add hindi language and theme options in it`);
                                }
                            }}
                            className={`flex items-center gap-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group cursor-pointer
                                ${isCollapsed ? "justify-center px-2" : "justify-start px-3"}
                                ${isItemActive
                                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/40"
                                }`}
                            title={isCollapsed ? item.name : undefined}
                        >
                            <div className={`flex-shrink-0 transition-colors
                                ${isItemActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"}`}
                            >
                                {item.icon}
                            </div>
                            {!isCollapsed && (
                                <span className="flex-1 truncate">{item.name}</span>
                            )}
                            {!isCollapsed && item.hasDropdown && (
                                <ChevronDown className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-400 ml-auto" />
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            {/* Sidebar Footer / User Logout */}
            <div className="p-3 border-t border-slate-800/80 bg-slate-950/20">
                <button
                    onClick={handleLogout}
                    className={`flex items-center gap-3 w-full py-2.5 rounded-lg text-sm font-medium text-rose-400 hover:text-rose-200 hover:bg-rose-500/10 transition-all duration-150 cursor-pointer
                        ${isCollapsed ? "justify-center px-2" : "justify-start px-3"}`}
                    title="Sign Out"
                >
                    <LogOut className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && <span>Sign Out</span>}
                </button>
            </div>
        </aside>
    </>
}

export default SideBar