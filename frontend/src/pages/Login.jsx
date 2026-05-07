import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { HeartPulse, Loader2 } from "lucide-react";
import { loginFailure, loginStart, loginSuccess } from "../features/auth/authSlice";

export default function Login() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("rep@helixcrm.ai");

  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(loginStart());
    window.setTimeout(() => {
      if (!email.includes("@")) {
        dispatch(loginFailure("Enter a valid company email"));
        return;
      }
      dispatch(loginSuccess({ name: "Ananya Sharma", email, role: "Field Representative", territory: "Mumbai West Territory" }));
    }, 600);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
        <section className="flex flex-col justify-between px-6 py-8 sm:px-10 lg:px-14">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-500">
              <HeartPulse className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold">HelixCRM AI</p>
              <p className="text-xs text-slate-400">HCP engagement intelligence</p>
            </div>
          </div>
          <div className="max-w-2xl py-16">
            <p className="label text-brand-100">AI-first healthcare CRM</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
              Log richer HCP interactions with less administrative drag.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
              Capture structured call notes, summarize conversations, extract medical and account entities, and recommend compliant next actions.
            </p>
          </div>
          <p className="text-xs text-slate-500">Designed & Developed by Chaitanya Jain using LangGraph, Groq & FastAPI</p>
        </section>
        <section className="flex items-center justify-center bg-white px-6 py-10 text-slate-900">
          <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg border border-slate-200 p-6 shadow-soft">
            <h2 className="text-2xl font-bold text-slate-950">Sign in</h2>
            <p className="mt-2 text-sm text-slate-600">Use the demo account or your company email.</p>
            <label className="mt-6 block space-y-2">
              <span className="label">Email</span>
              <input className="input" value={email} onChange={(event) => setEmail(event.target.value)} />
            </label>
            <label className="mt-4 block space-y-2">
              <span className="label">Password</span>
              <input className="input" type="password" defaultValue="demo-password" />
            </label>
            {error && <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
            <button className="mt-6 w-full btn-primary" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Continue
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
