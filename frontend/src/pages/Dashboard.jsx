import { Link } from "react-router-dom";
import { CalendarCheck, ClipboardList, TrendingUp, Users } from "lucide-react";
import { useSelector } from "react-redux";
import MetricCard from "../components/common/MetricCard";
import PageHeader from "../components/common/PageHeader";
import InteractionTable from "../components/interactions/InteractionTable";

export default function Dashboard() {
  const interactions = useSelector((state) => state.interactions.items);
  const aiInsights = useSelector((state) => state.dashboard.aiInsights);

  return (
    <>
      <PageHeader
        eyebrow="Today"
        title="Field engagement dashboard"
        description="Monitor HCP interaction activity, follow-up commitments, and AI-assisted account signals across your territory."
        action={
          <Link className="btn-primary" to="/interactions/new">
            <ClipboardList className="h-4 w-4" />
            Log interaction
          </Link>
        }
      />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Interactions this week" value="28" change="+12% vs prior week" icon={ClipboardList} tone="brand" />
        <MetricCard label="Active HCPs" value="142" change="18 high priority accounts" icon={Users} tone="blue" />
        <MetricCard label="Follow-ups due" value="9" change="3 due today" icon={CalendarCheck} tone="amber" />
        <MetricCard label="Positive sentiment" value="76%" change="+5 pts after AI coaching" icon={TrendingUp} tone="slate" />
      </section>
      <section className="mt-6 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-950">Recent interactions</h2>
            <Link className="text-sm font-semibold text-brand-700" to="/interactions">
              View all
            </Link>
          </div>
          <InteractionTable interactions={interactions.slice(0, 4)} />
        </div>
        <div className="panel p-5">
          <h2 className="text-lg font-bold text-slate-950">AI territory insights</h2>
          <div className="mt-4 space-y-3">
            {aiInsights.map((insight) => (
              <div key={insight} className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-700">
                {insight}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
