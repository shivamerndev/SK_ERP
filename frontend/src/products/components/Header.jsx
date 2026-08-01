
import { Bell, Info, Search, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const Header = ({
  filteredProducts = [],
  isSearchOpen,
  setIsSearchOpen,
  searchQuery,
  setSearchQuery,
  notifications = [],
  setNotifications,
  showNotificationsList,
  setShowNotificationsList,
  notificationRef
}) => {
  const { t } = useLanguage();
  return (
    <div className="flex items-center justify-between bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">{t("productsTitle")}</h1>
        <span className="bg-blue-50 text-blue-700 font-semibold px-3 py-1 rounded-full text-xs transition-all hover:bg-blue-100/80">
          {filteredProducts.length} items
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Magnifying Glass Search Toggle */}
        <div className="relative flex items-center">
          {isSearchOpen && (
            <input
              type="text"
              placeholder="Search products, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-56 sm:w-64 bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 mr-2 transition-all"
              autoFocus
            />
          )}
          <button
            onClick={() => {
              setIsSearchOpen(!isSearchOpen);
              if (isSearchOpen) setSearchQuery("");
            }}
            className={`p-2.5 rounded-xl transition-all ${isSearchOpen ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "hover:bg-slate-50 text-slate-500 hover:text-blue-600"
              }`}
            title="Search Products"
          >
            {isSearchOpen ? <X size={20} /> : <Search size={20} />}
          </button>
        </div>

        {/* Notification Bell */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotificationsList(!showNotificationsList)}
            className="relative p-2.5 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-blue-600 transition-all"
          >
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* Notification Dropdown Panel */}
          {showNotificationsList && (
            <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 shadow-xl rounded-2xl py-2 z-30 transition-all">
              <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-2xl">
                <span className="font-bold text-sm text-slate-800">Notifications Log</span>
                <button
                  onClick={() => setNotifications([])}
                  className="text-xs text-rose-500 hover:text-rose-700 font-semibold transition-colors"
                >
                  Clear All
                </button>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-6 text-center text-xs text-slate-400 flex flex-col items-center gap-1">
                    <Info size={16} className="text-slate-300" />
                    No recent activities logged
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="px-4 py-3 hover:bg-slate-50/80 border-b border-slate-100/50 flex gap-2.5 items-start">
                      <span className={`w-2 h-2 mt-1.5 rounded-full ${n.type === "success" ? "bg-emerald-500" : n.type === "danger" ? "bg-rose-500" : "bg-blue-500"
                        }`} />
                      <div className="flex-1 flex flex-col">
                        <span className="text-xs text-slate-700 font-medium leading-relaxed">{n.message}</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">{n.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;