"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError(true);
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-8 bg-bg">
      <form
        onSubmit={handleSubmit}
        className="bg-surface-lowest rounded-[3rem] p-12 w-full max-w-[400px] shadow-[0_12px_60px_rgba(46,47,45,0.06)] text-center"
      >
        <h1
          className="font-display text-[2.5rem] font-extrabold bg-gradient-to-br from-primary to-primary-container bg-clip-text text-transparent mb-2"
        >
          MRBin
        </h1>
        <p className="text-on-surface-variant text-[0.9rem] mb-12">
          Your friendly smart bin companion
        </p>

        <div className="text-left mb-5">
          <label className="block text-[0.8rem] font-medium text-on-surface-variant uppercase tracking-wider mb-2">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            className="w-full px-5 py-3.5 bg-surface-container rounded-[1.5rem] text-[0.95rem] outline-none transition-colors focus:bg-surface-high text-on-surface placeholder:text-on-surface-variant/50"
          />
        </div>

        <div className="text-left mb-5">
          <label className="block text-[0.8rem] font-medium text-on-surface-variant uppercase tracking-wider mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full px-5 py-3.5 bg-surface-container rounded-[1.5rem] text-[0.95rem] outline-none transition-colors focus:bg-surface-high text-on-surface placeholder:text-on-surface-variant/50"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-5 py-3.5 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-full font-semibold text-[0.95rem] shadow-[0_4px_20px_rgba(113,88,0,0.2)] hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        {error && (
          <p className="text-danger text-[0.85rem] mt-4">
            Invalid username or password
          </p>
        )}

        <p className="text-[0.8rem] text-on-surface-variant mt-8">
          Demo: admin / mrbin2025
        </p>
      </form>
    </div>
  );
}
