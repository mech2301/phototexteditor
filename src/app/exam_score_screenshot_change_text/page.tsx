import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Exam Score Screenshot Text Edit - PhoText",
  description: "Edit text in exam score screenshots. Update scores, grades, and student information.",
};

export default function ExamScorePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900">Exam Score Screenshot Text Edit</h1>
      <p className="mt-4 text-lg text-gray-600">
        Edit text in exam score screenshots. Modify scores, grades, subject
        names, and student details.
      </p>
      <Link href="/editor" className="mt-8 inline-block px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors">
        Edit Score
      </Link>
    </div>
  );
}
