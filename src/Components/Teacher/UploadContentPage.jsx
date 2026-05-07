import UploadForm from "./UploadForm";

export default function UploadContentPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* ── Header ───────────────────────────────────── */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Upload Content</h1>
        <p className="text-gray-500 text-sm mt-1">
          Fill in the details below. Your content will be sent to the principal
          for approval before going live.
        </p>
      </div>

      {/* ── Info Banner ──────────────────────────────── */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-4 mb-6">
        <p className="text-blue-700 text-sm font-medium">📋 How it works</p>
        <ul className="text-blue-500 text-xs mt-1 space-y-0.5 list-disc list-inside">
          <li>Submit your content for principal review</li>
          <li>Principal approves or rejects with a reason</li>
          <li>Approved content goes live on your live page</li>
        </ul>
      </div>

      {/* ── Form Card ────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <UploadForm />
      </div>
    </div>
  );
}
