import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useSelector } from "react-redux";
import PageHeader from "../components/common/PageHeader";
import InteractionTable from "../components/interactions/InteractionTable";

export default function InteractionHistory() {
  const interactions = useSelector((state) => state.interactions.items);
  const [query, setQuery] = useState("");
  const [sentiment, setSentiment] = useState("");

  const filteredInteractions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return interactions;
    return interactions.filter((item) =>
      (!sentiment || item.sentiment === sentiment) &&
      [item.hcpName, item.specialty, item.interactionType, item.status, item.sentiment, item.topicsDiscussed]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalized)
    );
  }, [interactions, query, sentiment]);

  return (
    <>
      <PageHeader
        eyebrow="Records"
        title="Interaction history"
        description="Review logged HCP interactions, AI sentiment, topics, and follow-up commitments across the territory."
      />
      <div className="mb-4 grid max-w-3xl gap-3 sm:grid-cols-[1fr_180px]">
        <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            className="w-full text-sm outline-none"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by HCP, specialty, topic, status"
          />
        </div>
        <select className="input" value={sentiment} onChange={(event) => setSentiment(event.target.value)}>
          <option value="">All sentiment</option>
          <option>Positive</option>
          <option>Neutral</option>
          <option>Negative</option>
        </select>
      </div>
      <InteractionTable interactions={filteredInteractions} />
    </>
  );
}
