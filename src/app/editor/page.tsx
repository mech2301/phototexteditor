"use client";

import dynamic from "next/dynamic";
import ErrorBoundary from "./ErrorBoundary";

const EditorClient = dynamic(() => import("./EditorClient"), { ssr: false });

export default function EditorPage() {
  return (
    <ErrorBoundary>
      <EditorClient />
    </ErrorBoundary>
  );
}
