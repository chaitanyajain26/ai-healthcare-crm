import { useDispatch, useSelector } from "react-redux";
import { Bell, LogOut, Search } from "lucide-react";
import { logout } from "../../features/auth/authSlice";

export default function Topbar() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="hidden max-w-md flex-1 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 md:flex">
          <Search className="h-4 w-4 text-slate-400" />
          <input className="w-full bg-transparent text-sm outline-none" placeholder="Search HCPs, interactions, accounts" />
        </div>
        <div className="ml-auto flex items-center gap-3">
          <button className="btn-secondary h-10 w-10 px-0" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </button>
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-slate-900">{user?.name || "Field Representative"}</p>
            <p className="text-xs text-slate-500">{user?.territory || "Mumbai West Territory"}</p>
          </div>
          <button className="btn-secondary" onClick={() => dispatch(logout())}>
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
