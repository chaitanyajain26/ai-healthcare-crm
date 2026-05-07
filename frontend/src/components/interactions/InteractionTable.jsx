import StatusBadge from "../common/StatusBadge";

import { Edit3 } from "lucide-react";

export default function InteractionTable({ interactions }) {
  return (
    <div className="panel overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">HCP</th>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Topics</th>
              <th className="px-4 py-3 font-semibold">Sentiment</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {interactions.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-4 py-4">
                  <p className="font-semibold text-slate-950">{item.hcpName}</p>
                  <p className="text-xs text-slate-500">{item.specialty || "Healthcare Professional"}</p>
                </td>
                <td className="px-4 py-4 text-slate-600">{item.interactionType}</td>
                <td className="px-4 py-4 text-slate-600">
                  {item.date} {item.time}
                </td>
                <td className="px-4 py-4 text-slate-600">{Array.isArray(item.topics) ? item.topics.join(", ") : item.topicsDiscussed}</td>
                <td className="px-4 py-4">
                  <StatusBadge tone={item.sentiment === "Positive" ? "positive" : "neutral"}>{item.sentiment || "Pending"}</StatusBadge>
                </td>
                <td className="px-4 py-4">
                  <StatusBadge tone={item.status?.includes("due") ? "warning" : "slate"}>{item.status || "Draft"}</StatusBadge>
                </td>
                <td className="px-4 py-4">
                  <button className="btn-secondary px-2.5 py-2" aria-label={`Edit ${item.hcpName}`}>
                    <Edit3 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
