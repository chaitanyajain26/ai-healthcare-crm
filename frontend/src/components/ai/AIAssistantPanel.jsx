import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Brain, Send, Sparkles } from "lucide-react";
import { addUserMessage, analyzeInteraction, sendAssistantMessage } from "../../features/aiAssistant/aiAssistantSlice";
import StatusBadge from "../common/StatusBadge";

export default function AIAssistantPanel({ draftInteraction }) {
  const dispatch = useDispatch();
  const { messages, analysis, loading } = useSelector((state) => state.aiAssistant);
  const [message, setMessage] = useState("");

  const handleSend = (event) => {
    event.preventDefault();
    if (!message.trim()) return;
    dispatch(addUserMessage(message));
    dispatch(sendAssistantMessage({ message, draftInteraction }));
    setMessage("");
  };

  return (
    <aside className="panel flex min-h-[720px] flex-col overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-950 p-5 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-bold">AI Assistant</h2>
            <p className="text-xs text-slate-300">LangGraph + Groq intelligence layer</p>
          </div>
        </div>
        <button className="mt-4 w-full btn-primary" onClick={() => dispatch(analyzeInteraction(draftInteraction))}>
          <Sparkles className="h-4 w-4" />
          Analyze draft
        </button>
      </div>

      <div className="grid gap-3 border-b border-slate-200 p-4">
        <div>
          <p className="label mb-2">Summary</p>
          <p className="rounded-md bg-slate-50 p-3 text-sm leading-6 text-slate-700">{analysis.summary}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge tone={analysis.sentiment === "Positive" ? "positive" : "neutral"}>{analysis.sentiment}</StatusBadge>
          <span className="text-xs font-medium text-slate-500">{Math.round((analysis.confidence || 0.8) * 100)}% confidence</span>
        </div>
        <div>
          <p className="label mb-2">Entities</p>
          <div className="flex flex-wrap gap-2">
            {analysis.entities?.map((entity) => (
              <span key={entity} className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                {entity}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="label mb-2">Suggested actions</p>
          <ul className="space-y-2 text-sm text-slate-700">
            {analysis.suggestedActions?.map((action) => (
              <li key={action} className="rounded-md border border-slate-200 bg-white px-3 py-2">
                {action}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
        {messages.map((item, index) => (
          <div key={`${item.role}-${index}`} className={`flex ${item.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[88%] rounded-lg px-3 py-2 text-sm leading-6 ${
                item.role === "user" ? "bg-brand-600 text-white" : "border border-slate-200 bg-white text-slate-700"
              }`}
            >
              {item.content}
            </div>
          </div>
        ))}
        {loading && <div className="h-9 w-32 animate-pulse rounded-lg bg-slate-200" />}
      </div>

      <form onSubmit={handleSend} className="flex gap-2 border-t border-slate-200 bg-white p-3">
        <input
          className="input"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Ask for a summary or follow-up plan"
        />
        <button className="btn-primary px-3" aria-label="Send message">
          <Send className="h-4 w-4" />
        </button>
      </form>
    </aside>
  );
}
