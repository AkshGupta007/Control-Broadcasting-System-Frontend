import React, { memo } from "react";

const ContentCard = ({ item, onApprove, onReject,setmodaldata }) => {
  return (
    <div className="flex gap-x-4 w-11/12 border rounded-lg shadow-sm p-4 mb-4 bg-white">
      {/* Content Info */}
      <div className="flex-1">
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

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 justify-center">
        <button
          onClick={() => onApprove(item.id)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition"
        >
          APPROVE
        </button>
        <button
          onClick={() =>
            setmodaldata({
              text1: "Reject Content?",
              text2: "Are you sure you want to reject this submission?",
              btn1text: "Yes, Reject",
              btn2text: "Cancel",
              showReason:true,
              btn1handler: (reason) => {
                
                   onReject(item.id,reason),
                
                setmodaldata(null); // close modal
              },
              btn2handler: () => setmodaldata(null),
            })
          }
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition"
        >
          REJECT
        </button>
      </div>
    </div>
  );
};

export default memo(ContentCard);
