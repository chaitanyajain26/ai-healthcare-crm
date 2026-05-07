import { useDispatch, useSelector } from "react-redux";
import PageHeader from "../components/common/PageHeader";
import AIAssistantPanel from "../components/ai/AIAssistantPanel";
import InteractionForm from "../components/interactions/InteractionForm";
import { saveInteraction, updateDraft } from "../features/interactions/interactionSlice";

const initialDefaults = {
  date: new Date().toISOString().slice(0, 10),
  time: "10:30"
};

export default function LogInteraction() {
  const dispatch = useDispatch();
  const { draft, saving } = useSelector((state) => state.interactions);
  const form = { ...initialDefaults, ...draft };

  const handleSubmit = (event) => {
    event.preventDefault();
    const normalized = {
      ...form,
      topics: form.topicsDiscussed?.split(",").map((topic) => topic.trim()).filter(Boolean) || [],
      followUpActions: form.followUpActions?.split(",").map((action) => action.trim()).filter(Boolean) || []
    };
    dispatch(saveInteraction(normalized));
  };

  return (
    <>
      <PageHeader
        eyebrow="HCP interaction"
        title="Log interaction"
        description="Capture call details in a structured form while the AI assistant summarizes, extracts entities, scores sentiment, and recommends follow-up actions."
      />
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <InteractionForm form={form} onChange={(patch) => dispatch(updateDraft(patch))} onSubmit={handleSubmit} saving={saving} />
        <AIAssistantPanel draftInteraction={form} />
      </section>
    </>
  );
}
