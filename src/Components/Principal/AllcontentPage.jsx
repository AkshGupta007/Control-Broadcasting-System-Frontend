import React, { memo, useEffect, useMemo, useState } from "react";
import { fetchAllContentThunk } from "../../Slices/contentSlice";
import { useDispatch, useSelector } from "react-redux";

const PAGE_SIZE = 60;

const ContentSummaryCard = memo(function ContentSummaryCard({ item }) {
  return (
    <div className="border rounded-lg shadow-sm p-4 bg-white hover:shadow-md transition">
      <h2 className="font-bold text-lg text-gray-800 mb-2">{item.title}</h2>
      <p className="text-sm text-gray-600">Subject: {item.subject}</p>
      <p className="text-sm text-gray-600">Teacher: {item.teacherName}</p>
      <p
        className={`text-sm font-semibold mt-2 ${
          item.status === "approved"
            ? "text-green-600"
            : item.status === "pending"
              ? "text-yellow-600"
              : "text-red-600"
        }`}
      >
        Status: {item.status}
      </p>
    </div>
  );
});

const AllcontentPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchAllContentThunk());
    }
  }, [dispatch, user?.id]);

  const { items } = useSelector((state) => state.content);
  const visibleItems = useMemo(
    () => items.slice(0, visibleCount),
    [items, visibleCount],
  );

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [items.length]);

  return (
    <div className="p-6">
      {items.length === 0 ? (
        <p className="text-center text-gray-500">NO CONTENT</p>
      ) : (
        <>
          <p className="mb-4 text-sm text-gray-500">
            Showing {visibleItems.length} of {items.length} items
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleItems.map((item) => (
              <ContentSummaryCard key={item.id} item={item} />
            ))}
          </div>
          {visibleCount < items.length && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllcontentPage;
