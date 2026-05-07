import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchMyContentThunk,
  selectMyContent,
  selectContentLoading,
  selectFilters,
  setFilter,
} from "../../Slices/contentSlice"
import { selectUser } from "../../Slices/authSlice";
import ContentStatusBadge from "../Common/ContentStatusBadge";
import EmptyState from "../Common/EmptyState";
import SkeletonTable from "../Common/SkeletonTable"

const PAGE_SIZE = 80;

export default function MyContentPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const myContent = useSelector(selectMyContent);
  const loading = useSelector(selectContentLoading);
  const filters = useSelector(selectFilters);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // ── Fetch on mount ─────────────────────────────────
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchMyContentThunk(user.id)); // ✅ pass teacherId directly
    }
  }, [dispatch, user?.id]);

  // ── Filter logic ───────────────────────────────────
  const filtered = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    return myContent.filter((item) => {
      const matchStatus =
        filters.status === "all" || item.status === filters.status;
      const matchSearch =
        !search ||
        item.title.toLowerCase().includes(search) ||
        item.subject.toLowerCase().includes(search);

      return matchStatus && matchSearch;
    });
  }, [filters.search, filters.status, myContent]);

  const visibleRows = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount],
  );

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filters.search, filters.status, myContent.length]);

  return (
    <div className="p-6 space-y-6">
      {/* ── Header ───────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Content</h1>
          <p className="text-gray-500 text-sm mt-1">
            All content you have uploaded
          </p>
        </div>
        <button
          onClick={() => navigate("/teacher/upload")}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
        >
          + Upload New
        </button>
      </div>

      {/* ── Filters ──────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <input
          type="text"
          placeholder="Search by title or subject..."
          value={filters.search}
          onChange={(e) => dispatch(setFilter({ search: e.target.value }))}
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => dispatch(setFilter({ status: e.target.value }))}
          className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white transition"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* ── Content Count ────────────────────────────── */}
      {!loading && (
        <p className="text-sm text-gray-400">
          Showing {filtered.length} of {myContent.length} items
        </p>
      )}

      {/* ── Table ────────────────────────────────────── */}
      {loading ? (
        <SkeletonTable />
      ) : filtered.length === 0 ? (
        <EmptyState
          message={
            myContent.length === 0
              ? "You haven't uploaded any content yet."
              : "No content matches your filter."
          }
          actionLabel={myContent.length === 0 ? "Upload Now" : null}
          actionPath="/teacher/upload"
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-5 py-3 text-left">Title</th>
                <th className="px-5 py-3 text-left">Subject</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-left">Start Time</th>
                <th className="px-5 py-3 text-left">Duration</th>
                <th className="px-5 py-3 text-left">Rejection Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {visibleRows.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  {/* Title */}
                  <td className="px-5 py-3 font-medium text-gray-800">
                    {item.title}
                  </td>

                  {/* Subject */}
                  <td className="px-5 py-3 text-gray-500">{item.subject}</td>

                  {/* Status */}
                  <td className="px-5 py-3">
                    <ContentStatusBadge status={item.status} />
                  </td>

                  {/* Start Time */}
                  <td className="px-5 py-3 text-gray-400">
                    {new Date(item.startTime).toLocaleString()}
                  </td>

                  {/* Rotation Duration */}
                  <td className="px-5 py-3 text-gray-400">
                    {item.rotationDuration}s
                  </td>

                  {/* Rejection Reason */}
                  <td className="px-5 py-3">
                    {item.rejectionReason ? (
                      <span className="text-red-500 text-xs">
                        {item.rejectionReason}
                      </span>
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {visibleCount < filtered.length && (
            <div className="flex justify-center border-t border-gray-100 p-4">
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
