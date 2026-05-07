import React, { useState } from "react";

const ConfirmationModal = ({ modaldata }) => {
  const [reason, setReason] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-700 shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
        {/* Heading */}
        <div className="mb-3">
          <h1 className="text-2xl font-bold text-white">{modaldata.text1}</h1>

          <p className="mt-2 text-sm text-zinc-300 leading-relaxed">
            {modaldata.text2}
          </p>
        </div>

        {/* Reason Input */}
        {modaldata.showReason && (
          <div className="mt-5">
            <label className="block text-sm font-medium text-zinc-200 mb-2">
              Rejection Reason
            </label>

            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              placeholder="Enter rejection reason..."
              className="
                w-full rounded-xl bg-zinc-800 border border-zinc-600
                px-4 py-3 text-sm text-white placeholder:text-zinc-400
                outline-none focus:ring-2 focus:ring-yellow-400
                resize-none transition-all duration-200
              "
            />
          </div>
        )}

        {/* Buttons */}
        <div className="mt-8 flex items-center justify-end gap-3">
          <button
            onClick={modaldata.btn2handler}
            className="
              rounded-xl border border-zinc-600
              bg-zinc-800 px-5 py-2.5
              text-sm font-medium text-zinc-200
              hover:bg-zinc-700 transition-all duration-200
            "
          >
            {modaldata.btn2text}
          </button>

          <button
            onClick={() => modaldata.btn1handler(reason)}
            className="
              rounded-xl bg-yellow-400
              px-5 py-2.5 text-sm font-semibold
              text-black shadow-lg
              hover:bg-yellow-300
              active:scale-95
              transition-all duration-200
            "
          >
            {modaldata.btn1text}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
