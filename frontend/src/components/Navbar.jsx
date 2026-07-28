import { useEffect, useState } from "react"
import useNavbar from "../navigations/useNavbar"
import { Link } from "react-router-dom"


const Navbar = ({ user, setIsMobileSidebarOpen }) => {


    const { results, handleSearch } = useNavbar()

    const [search, setSearch] = useState("")

    useEffect(() => {
        const delay = setTimeout(() => {
            handleSearch(search)
        }, 500);
        return () => clearTimeout(delay);
    }, [search])

    return <header className="sticky top-0 z-30 flex items-center justify-between bg-white border-b border-slate-200/80 px-4 sm:px-6 py-3 shadow-sm shadow-slate-100">


        <div className="flex items-center gap-3 flex-1">


            <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 focus:outline-none transition-colors"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* Search Input */}
            <div className="relative max-w-xs sm:max-w-md w-full">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </span>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search anything..."
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-slate-50/50 focus:bg-white text-slate-700"
                />

                {
                    search.length > 0 && (
                        <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-200/80 rounded-2xl shadow-xl p-2 z-50 max-h-[350px] overflow-y-auto backdrop-blur-lg bg-white/95 border-b-4 border-b-blue-500/10">
                            {results.length === 0 ? (
                                <div className="p-6 text-center text-slate-400 flex flex-col items-center gap-2">
                                    <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-sm font-medium">No results found</span>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-1">
                                    <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                        Search Results ({results.length})
                                    </div>
                                    <ul className="divide-y divide-slate-100/50">
                                        {results.map((result) => (
                                            <li key={result._id}>
                                                <Link
                                                    to={result.url}
                                                    onClick={() => setSearch("")}
                                                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-all group"
                                                >
                                                    {result.type === "category" ? (
                                                        <>
                                                            {/* Avatar block with category icon */}
                                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100/40 text-emerald-600 flex items-center justify-center font-bold text-sm group-hover:from-emerald-600 group-hover:to-teal-600 group-hover:text-white transition-all flex-shrink-0">
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M6 20h12a2 2 0 002-2V9a2 2 0 00-2-2h-1L11 3H6a2 2 0 00-2 2v13a2 2 0 002 2z" />
                                                                </svg>
                                                            </div>

                                                            {/* Category details */}
                                                            <div className="flex flex-col flex-1 min-w-0">
                                                                <div className="flex items-center justify-between gap-2">
                                                                    <span className="font-semibold text-slate-700 text-sm group-hover:text-emerald-600 transition-colors truncate capitalize">
                                                                        {result.name}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-400">
                                                                    <span className="bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider scale-95 origin-left">
                                                                        Category
                                                                    </span>
                                                                    <span className="text-slate-400 text-[11px]">Filter Products</span>
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : result.type === "product" ? (
                                                        <>
                                                            {/* Avatar block with product image or placeholder */}
                                                            {result.image ? (
                                                                <img
                                                                    src={result.image}
                                                                    alt={result.name}
                                                                    className="w-9 h-9 rounded-full object-cover border border-slate-100/40 flex-shrink-0"
                                                                />
                                                            ) : (
                                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100/40 text-amber-600 flex items-center justify-center font-bold text-sm group-hover:from-amber-600 group-hover:to-orange-600 group-hover:text-white transition-all flex-shrink-0">
                                                                    P
                                                                </div>
                                                            )}

                                                            {/* Product Information details */}
                                                            <div className="flex flex-col flex-1 min-w-0">
                                                                <div className="flex items-center justify-between gap-2">
                                                                    <span className="font-semibold text-slate-700 text-sm group-hover:text-blue-600 transition-colors truncate">
                                                                        {result.name}
                                                                    </span>
                                                                    <span className="text-[10px] text-slate-400 font-semibold flex-shrink-0 bg-slate-100/60 px-1.5 py-0.5 rounded-md">
                                                                        {result.pieces} pcs
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-400">
                                                                    <span className="bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider scale-95 origin-left">
                                                                        {result.category}
                                                                    </span>
                                                                    <span className="text-slate-400 text-[11px]">Product</span>
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            {/* Avatar block with initials */}
                                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/40 text-blue-600 flex items-center justify-center font-bold text-sm group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white transition-all flex-shrink-0">
                                                                {result.fullName ? result.fullName.charAt(0).toUpperCase() : "?"}
                                                            </div>

                                                            {/* Customer Information details */}
                                                            <div className="flex flex-col flex-1 min-w-0">
                                                                <div className="flex items-center justify-between gap-2">
                                                                    <span className="font-semibold text-slate-700 text-sm group-hover:text-blue-600 transition-colors truncate">
                                                                        {result.fullName}
                                                                    </span>
                                                                    {result.phone && (
                                                                        <span className="text-[10px] text-slate-400 font-semibold flex-shrink-0 bg-slate-100/60 px-1.5 py-0.5 rounded-md">
                                                                            {result.phone}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-400">
                                                                    {result.shopName && (
                                                                        <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider scale-95 origin-left">
                                                                            {result.shopName}
                                                                        </span>
                                                                    )}
                                                                    {result.address && (
                                                                        <span className="truncate max-w-[200px] text-slate-400 text-[11px]">
                                                                            {result.address}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )
                }
            </div>
        </div>

        {/* Right: Quick Action Controls & User details */}
        <div className="flex items-center gap-3 sm:gap-5">
            {/* Live System Badge */}
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Live System
            </span>

            {/* Action Icons */}
            <div className="flex items-center gap-1 sm:gap-2">
                {/* Help / Question mark */}
                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors" title="Help">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>

                {/* Notifications bell */}
                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg relative transition-colors" title="Notifications">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold border border-white">
                        2
                    </span>
                </button>

                {/* Settings cog */}
                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors" title="Settings">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>
            </div>

            {/* Vertical Separator */}
            <div className="w-[1px] h-7 bg-slate-200" />

            {/* User Details */}
            <div className="flex items-center gap-2.5">
                {user?.avatar ? (
                    <img src={user.avatar} alt={user?.fullName} className="w-8 h-8 sm:w-9.5 sm:h-9.5 rounded-full object-cover border-2 border-slate-200 shadow-sm" />
                ) : (
                    <div className="w-8 h-8 sm:w-9.5 sm:h-9.5 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                        {user?.fullName ? user?.fullName.charAt(0).toUpperCase() : "U"}
                    </div>
                )}
                <div className="hidden md:flex flex-col text-left">
                    <span className="text-sm font-semibold text-slate-800 leading-tight">{user?.fullName || "John Smith"}</span>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider leading-none mt-0.5">{user?.role || "System Admin"}</span>
                </div>
                <svg className="w-4 h-4 text-slate-400 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    </header>
}

export default Navbar