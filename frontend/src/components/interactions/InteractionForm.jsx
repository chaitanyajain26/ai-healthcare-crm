import { Save } from "lucide-react";
import { Field } from "../common/Field";

const hcpOptions = ["Dr. Aisha Menon", "Dr. Vikram Rao", "Dr. Neha Kapoor", "Dr. Arjun Shah"];
const interactionTypes = ["In-person visit", "Virtual call", "Medical conference", "Lunch meeting", "Phone call"];

export default function InteractionForm({ form, onChange, onSubmit, saving }) {
  const setValue = (field) => (event) => onChange({ [field]: event.target.value });

  return (
    <form onSubmit={onSubmit} className="panel p-5">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="HCP Name">
          <select className="input" value={form.hcpName || ""} onChange={setValue("hcpName")} required>
            <option value="">Select HCP</option>
            {hcpOptions.map((hcp) => (
              <option key={hcp}>{hcp}</option>
            ))}
          </select>
        </Field>
        <Field label="Interaction Type">
          <select className="input" value={form.interactionType || ""} onChange={setValue("interactionType")} required>
            <option value="">Select type</option>
            {interactionTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </Field>
        <Field label="Date">
          <input className="input" type="date" value={form.date || ""} onChange={setValue("date")} required />
        </Field>
        <Field label="Time">
          <input className="input" type="time" value={form.time || ""} onChange={setValue("time")} required />
        </Field>
        <Field label="Attendees">
          <input className="input" value={form.attendees || ""} onChange={setValue("attendees")} placeholder="MSL, nurse educator, account manager" />
        </Field>
        <Field label="Materials Shared">
          <input className="input" value={form.materialsShared || ""} onChange={setValue("materialsShared")} placeholder="Dosing guide, study reprint" />
        </Field>
        <div className="md:col-span-2">
          <Field label="Topics Discussed">
            <input className="input" value={form.topicsDiscussed || ""} onChange={setValue("topicsDiscussed")} placeholder="Adherence, formulary, patient onboarding" />
          </Field>
        </div>
        <div className="md:col-span-2">
          <Field label="Notes">
            <textarea
              className="input min-h-40 resize-y"
              value={form.notes || ""}
              onChange={setValue("notes")}
              placeholder="Capture HCP questions, objections, clinical interests, and commitments"
            />
          </Field>
        </div>
        <div className="md:col-span-2">
          <Field label="Follow-up Actions">
            <textarea
              className="input min-h-24 resize-y"
              value={form.followUpActions || ""}
              onChange={setValue("followUpActions")}
              placeholder="Send materials, schedule follow-up, involve MSL"
            />
          </Field>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button className="btn-primary" disabled={saving}>
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Interaction"}
        </button>
      </div>
    </form>
  );
}
