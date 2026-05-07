import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLiveContentThunk,
  clearLiveContent,
  showNextContent,
  showPreviousContent,
  showContentAtIndex,
} from "../Slices/LiveContentSlice";

export default function LivePage() {
  const { teacherId } = useParams();
  const dispatch = useDispatch();
  const { items, activeContent, activeIndex, loading, error, isEmpty } = useSelector(
    (state) => state.live,
  );

  // ── Fetch on mount + poll every 30s ───────────────
  useEffect(() => {
    dispatch(fetchLiveContentThunk(teacherId));

    const interval = setInterval(() => {
      dispatch(fetchLiveContentThunk(teacherId));
    }, 30000);

    return () => {
      clearInterval(interval);
      dispatch(clearLiveContent());
    };
  }, [dispatch, teacherId]);

  useEffect(() => {
    if (!activeContent || items.length <= 1) return;

    const duration = Number(activeContent.rotationDuration) || 30;
    const timeout = setTimeout(() => {
      dispatch(showNextContent());
    }, duration * 1000);

    return () => clearTimeout(timeout);
  }, [activeContent, dispatch, items.length]);

  // ── Loading ───────────────────────────────────────
  if (loading && !activeContent) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-white text-sm tracking-widest uppercase">
            Loading Content...
          </p>
        </div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-4xl">⚠️</p>
          <p className="text-white font-semibold">Something went wrong</p>
          <p className="text-gray-400 text-sm">{error}</p>
          <button
            onClick={() => dispatch(fetchLiveContentThunk(teacherId))}
            className="mt-4 px-6 py-2 bg-white text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ── Empty State ───────────────────────────────────
  if (isEmpty || !activeContent) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-6xl">📭</p>
          <p className="text-white text-xl font-semibold">No Active Content</p>
          <p className="text-gray-400 text-sm">
            There is no approved content broadcasting right now.
          </p>
          <p className="text-gray-600 text-xs mt-2">
            Auto-refreshes every 30 seconds
          </p>
        </div>
      </div>
    );
  }

  // ── Active Content ────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6">
      {/* Live Badge */}
      <div className="flex items-center gap-2 mb-8">
        <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
        <span className="text-red-400 text-xs font-semibold uppercase tracking-widest">
          Live
        </span>
      </div>

      {items.length > 1 && (
        <div className="flex items-center gap-3 mb-4">
          <button
            type="button"
            onClick={() => dispatch(showPreviousContent())}
            className="px-4 py-2 bg-gray-900 border border-gray-800 text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
          >
            Previous
          </button>
          <span className="text-gray-500 text-xs">
            {activeIndex + 1} / {items.length}
          </span>
          <button
            type="button"
            onClick={() => dispatch(showNextContent())}
            className="px-4 py-2 bg-gray-900 border border-gray-800 text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
          >
            Next
          </button>
        </div>
      )}

      {/* Content Card */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
        {/* Preview Image */}
        <div className="w-full h-64 bg-gray-800 flex items-center justify-center overflow-hidden">
          {activeContent.fileUrl ? (
            <img
              key={activeContent.id}
              src={activeContent.fileUrl}
              alt={activeContent.title}
              decoding="async"
              className="w-full h-full object-cover"
              onError={(e) => {
                // fallback if image fails to load
                e.currentTarget.style.display = "none";
                const fallback = e.currentTarget.parentElement.querySelector(
                  "[data-image-fallback]",
                );
                if (fallback) fallback.style.display = "flex";
              }}
              onLoad={(e) => {
                e.currentTarget.style.display = "block";
                const fallback = e.currentTarget.parentElement.querySelector(
                  "[data-image-fallback]",
                );
                if (fallback) fallback.style.display = "none";
              }}
            />
          ) : null}
          <div
            data-image-fallback
            className="w-full h-full hidden items-center justify-center text-gray-600 text-5xl"
          >
            🖼️
          </div>
        </div>

        {/* Info */}
        <div className="p-6 space-y-4">
          {/* Subject Badge */}
          <span className="inline-block bg-blue-900 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full">
            {activeContent.subject}
          </span>

          {/* Title */}
          <h1 className="text-white text-2xl font-bold leading-snug">
            {activeContent.title}
          </h1>

          {/* Description */}
          {activeContent.description && (
            <p className="text-gray-400 text-sm leading-relaxed">
              {activeContent.description}
            </p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap gap-4 pt-2 border-t border-gray-800 text-xs text-gray-500">
            <span>🧑‍🏫 {activeContent.teacherName}</span>
            <span>
              🕐 {new Date(activeContent.startTime).toLocaleString()} →{" "}
              {new Date(activeContent.endTime).toLocaleString()}
            </span>
            <span>⏱ Rotation: {activeContent.rotationDuration}s</span>
          </div>
        </div>
      </div>

      {items.length > 1 && (
        <div className="w-full max-w-2xl mt-4">
          <select
            value={activeIndex}
            onChange={(event) =>
              dispatch(showContentAtIndex(Number(event.target.value)))
            }
            className="w-full bg-gray-900 border border-gray-800 text-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          >
            {items.map((item, index) => (
              <option key={item.id} value={index}>
                {item.title} - {item.subject}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Footer */}
      <p className="text-gray-700 text-xs mt-6">
        Auto-refreshes every 30 seconds • Auto-changes by rotation duration •
        CBS Portal
      </p>
    </div>
  );
}
