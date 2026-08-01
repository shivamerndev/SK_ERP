import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react"
import useAuth from "../auth/useAuth";
import { useLanguage } from "../context/LanguageContext";
import {
    LayoutDashboard,
    ClipboardList,
    ShoppingCart,
    Box,
    Users,
    BarChart3,
    Settings,
    HelpCircle,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    LogOut,
    IndianRupeeIcon,
    ShoppingBag,
    Notebook
} from "lucide-react";


const SideBar = ({ isMobileSidebarOpen, setIsMobileSidebarOpen }) => {

    const navigate = useNavigate()
    const { t } = useLanguage();

    const { handleLogout } = useAuth();
    const location = useLocation();

    const sidebarItems = [
        {
            key: "dashboard",
            name: "Dashboard",
            path: "/",
            icon: <LayoutDashboard className="w-5 h-5" />,
        },
        {
            key: "udhaar",
            name: "Lend",
            path: "/udhaar",
            icon: <ClipboardList className="w-5 h-5" />,
        },
        {
            key: "sales",
            name: "Sales",
            path: "/sales",
            icon: <ShoppingBag className="w-5 h-5" />,
        },
        {
            key: "purchases",
            name: "Purchases",
            path: "/purchases",
            icon: <ShoppingCart className="w-5 h-5" />,
        },
        {
            key: "inventory",
            name: "Inventory",
            path: "/inventory",
            icon: <Box className="w-5 h-5" />,
        },
        {
            key: "finance",
            name: "Finance",
            path: "/finance",
            icon: <IndianRupeeIcon className="w-5 h-5" />
        },
        {
            key: "customers",
            name: "Customers",
            path: "/customers",
            icon: <Users className="w-5 h-5" />
        },
        {
            key: "billing",
            name: "Billing",
            path: "/billing",
            icon: <Notebook className="w-5 h-5" />,
        },
        {
            key: "reports",
            name: "Reports",
            path: "/reports",
            icon: <BarChart3 className="w-5 h-5" />,
        },
        {
            key: "settings",
            name: "Settings",
            path: "/settings",
            icon: <Settings className="w-5 h-5" />,
        },
        {
            key: "help",
            name: "Help & Support",
            path: "/help",
            icon: <HelpCircle className="w-5 h-5" />,
        },
    ];

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobileSidebarOpen(false);
    }, [location, setIsMobileSidebarOpen]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024); // lg breakpoint is 1024px
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const isCollapsed = !isMobile && isSidebarCollapsed && !isHovered;

    return <>
        {isMobileSidebarOpen && (
            <div
                className="fixed inset-0 z-45 bg-[#0a0503]/80 backdrop-blur-md lg:hidden transition-opacity duration-300"
                onClick={() => setIsMobileSidebarOpen(false)}
            />
        )}

        <aside
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`fixed select-none lg:relative inset-y-0 left-0 z-50 flex flex-col bg-gradient-to-b from-[#180d07] via-[#120a05] to-[#0a0502] text-[#d4c3b3] border-r border-[#4a3219]/60 shadow-[5px_0_25px_rgba(0,0,0,0.6)] transition-all duration-300 transform
                lg:translate-x-0 lg:h-screen
                ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                ${isCollapsed ? "w-20" : "w-64"}`}
        >
            <div onClick={() => navigate("/")} className={`flex cursor-pointer items-center px-4 py-4 border-b border-[#3a2613]/70 ${isCollapsed ? "justify-center" : "justify-between"}`}>
                <div className={`flex items-center gap-3 transition-all duration-200 ${isCollapsed ? "justify-center" : ""}`}>
                    <figure className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-[#f3d078] via-[#b8860b] to-[#59390f] p-[2px] shadow-[0_0_12px_rgba(212,175,55,0.35)] flex items-center justify-center flex-shrink-0">
                        <img src="icon.png" alt="Suruchi Jewellers" className="w-full h-full object-cover rounded-full bg-[#120a05]" />
                    </figure>
                    {!isCollapsed && (
                        <div className="flex flex-col truncate">
                            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#ffeab3] via-[#f5cf6e] to-[#d4af37] text-base leading-tight tracking-tight drop-shadow-sm truncate">
                                {t("suruchiJewellers")}
                            </span>
                            <span className="text-[10px] text-[#b39568] font-medium tracking-wider uppercase mt-0.5 truncate">
                                {t("smartSolution")}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Collapse Arrow Desktop - Sleek Floating Metallic Button */}
            <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="hidden lg:flex absolute top-5 -right-3 z-50 items-center justify-center w-6 h-6 rounded-full bg-gradient-to-b from-[#2a1a0f] to-[#120a04] hover:from-[#3a2416] hover:to-[#1a0f07] text-[#f5d061] border border-[#855e24]/70 shadow-[0_2px_8px_rgba(0,0,0,0.6)] transition-all duration-200 hover:scale-110 cursor-pointer hover:border-[#d4af37]"
                title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
                {isSidebarCollapsed ? (
                    <ChevronRight className="w-3.5 h-3.5" strokeWidth={3} />
                ) : (
                    <ChevronLeft className="w-3.5 h-3.5" strokeWidth={3} />
                )}
            </button>

            {/* Scrollable Navigation Area */}
            <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1.5 scrollbar-none">
                {sidebarItems.map((item, idx) => {

                    // Highlight Inventory if currently in O2D
                    const isInventoryActive = item.name.includes("Inventory") && location.pathname === "/O2D";
                    const isItemActive = (location.pathname === item.path) || isInventoryActive;
                    const translatedLabel = t(item.key);

                    return (
                        <NavLink
                            key={idx}
                            to={item.path}
                            onClick={(e) => {
                                if (item.path === "/help") {
                                    e.preventDefault();
                                    alert(`This is for other's Buyers`);
                                    navigate(-1)
                                }
                            }}
                            className={`flex items-center gap-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group cursor-pointer border
                                ${isCollapsed ? "justify-center px-2" : "justify-start px-3.5"}
                                ${isItemActive
                                    ? "bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#c79928] text-[#140b04] font-bold shadow-[0_4px_16px_rgba(212,175,55,0.3)] border-[#ffe8ad]/60"
                                    : "border-transparent text-[#c7b299] hover:text-[#fff4d1] hover:bg-[#2a190d]/60 hover:border-[#6e4a21]/50"
                                }`}
                            title={isCollapsed ? translatedLabel : undefined}
                        >
                            <div className={`flex-shrink-0 transition-colors
                                ${isItemActive ? "text-[#140b04]" : "text-[#a3886b] group-hover:text-[#f7d479]"}`}
                            >
                                {item.icon}
                            </div>
                            {!isCollapsed && (
                                <span className="flex-1 truncate tracking-wide">{translatedLabel}</span>
                            )}
                            {!isCollapsed && item.hasDropdown && (
                                <ChevronDown className={`w-3.5 h-3.5 ml-auto transition-colors ${
                                    isItemActive ? "text-[#140b04]" : "text-[#876e53] group-hover:text-[#f7d479]"
                                }`} />
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            {/* Sidebar Footer / User Logout */}
            <div className="p-3 border-t border-[#3a2613]/70 bg-[#0a0502]/60">
                <button
                    onClick={handleLogout}
                    className={`flex items-center gap-3 w-full py-2.5 rounded-xl text-sm font-medium text-[#e57373] hover:text-[#ffcdd2] hover:bg-[#3d1414]/40 border border-transparent hover:border-[#852a2a]/40 transition-all duration-200 cursor-pointer
                        ${isCollapsed ? "justify-center px-2" : "justify-start px-3.5"}`}
                    title={t("signOut")}
                >
                    <LogOut className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && <span>{t("signOut")}</span>}
                </button>
            </div>
        </aside>
    </>
}

export default SideBar