import clsx from "clsx";
import React from "react";

const ContentStatusBadge = ({ status }) => {
  return (
    <div
      className={clsx("px-3 py-1 rounded text-sm font-semibold", {
        "bg-yellow-100 text-yellow-700": status === "pending",
        "bg-green-100 text-green-700": status === "approved",
        "bg-red-100 text-red-700": status === "rejected",
      })}
    >
      {status}
    </div>
  );
};

export default ContentStatusBadge;
