import { NavLink } from "react-router-dom";
import { Activity, Brain, ClipboardList, LayoutDashboard, Stethoscope } from "lucide-react";

const navItems = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Log Interaction", path: "/interactions/new", icon: ClipboardList },
  { label: "History", path: "/interactions", icon: Activity }
];

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-slate-200 bg-white lg:block">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Stethoscope className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-950">HelixCRM AI</p>
            <p className="text-xs text-slate-500">Healthcare field ops</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-4 py-5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition ${
                  isActive ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="m-4 rounded-lg border border-brand-100 bg-brand-50 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-brand-900">
            <Brain className="h-4 w-4" />
            AI Copilot Active
          </div>
          <p className="mt-2 text-xs leading-5 text-brand-900/80">
            Groq-ready LangGraph assistant for compliant HCP interaction intelligence.
          </p>
        </div>
      </div>
    </aside>
  );
}