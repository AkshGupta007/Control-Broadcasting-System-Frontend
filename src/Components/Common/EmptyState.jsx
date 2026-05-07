import React from "react";
import { useNavigate } from "react-router-dom";

const EmptyState = ({ message, actionLabel, actionPath }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-24 h-24 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
        <span className="text-3xl">📂</span>
      </div>
      <h2 className="text-xl font-semibold mb-2">No Data Found</h2>
      <p className="text-gray-600 mb-4">{message}</p>
      {actionPath && (
        <button
          onClick={() => navigate(actionPath)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
