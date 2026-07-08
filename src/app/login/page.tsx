import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Log In - PhoText",
  description: "Log in to your PhoText account.",
};

export default function LoginPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-border p-8">
        <h1 className="text-2xl font-bold text-center text-gray-900">Log In</h1>
        <p className="mt-2 text-sm text-center text-gray-500">
          Sign in to access all features
        </p>
        <form className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="w-full mt-1 px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="w-full mt-1 px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="••••••••"
            />
          </div>
          <button className="w-full py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors">
            Log In
          </button>
        </form>
        <p className="mt-4 text-xs text-center text-gray-400">
          Don&apos;t have an account?{" "}
          <Link href="/login" className="text-primary">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
