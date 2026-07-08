"use client";

import React from "react";

export default class ErrorBoundary extends React.Component<{ children: React.ReactNode; fallback?: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Editor crashed:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
          <div className="bg-white rounded-xl shadow-sm border border-border p-8 max-w-md text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <pre className="text-sm text-red-600 bg-red-50 rounded-lg p-4 mb-4 text-left overflow-auto max-h-32">{this.state.error?.message || "Unknown error"}</pre>
            <p className="text-sm text-gray-500 mb-4">Check the browser console (F12) for details.</p>
            <button onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}
              className="px-6 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-hover">
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
