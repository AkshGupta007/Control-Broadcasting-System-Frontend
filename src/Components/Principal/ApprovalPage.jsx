import React, { useCallback, useEffect, useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { fetchPendingContentThunk } from "../../Slices/contentSlice";

import { approveContentThunk, rejectContentThunk } from "../../Slices/Approval";

import ConfirmationModal from "../Common/ConfirmationModal";

import ContentCard from "./ContentCard";

const ApprovalPage = () => {

    
  const dispatch = useDispatch();

  
  const { user } = useSelector((state) => state.auth);

  const principalId=user.id;

 const onApprove = useCallback((contentId) => {
   dispatch(approveContentThunk({contentId, principalId}));
 }, [dispatch, principalId]);

 const onReject=useCallback((contentId,reason)=>{
    dispatch(rejectContentThunk({contentId,principalId,reason}))
 }, [dispatch, principalId]);

  const { pendingContent } = useSelector((state) => state.content);

  const[modaldata,setmodaldata]=useState(null);
  const [visibleCount, setVisibleCount] = useState(60);
  const visiblePendingContent = useMemo(
    () => pendingContent.slice(0, visibleCount),
    [pendingContent, visibleCount],
  );

const [hasFetched, setHasFetched] = useState(false);

useEffect(() => {
  if (user?.id) {
    dispatch(fetchPendingContentThunk()).then(() => setHasFetched(true));
  }
}, [dispatch, user?.id]);

useEffect(() => {
  setVisibleCount(60);
}, [pendingContent.length]);

  console.log("pending", pendingContent);

  return (
    //// content card
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Pending Approvals</h1>

      {pendingContent.length === 0 ? (
        <p>No pending content</p>
      ) : (
        visiblePendingContent.map((item) => {
          return (
        <ContentCard key={item.id} item={item} onApprove={onApprove} setmodaldata={setmodaldata} onReject={onReject}/>
          );
        })
      )}

      {visibleCount < pendingContent.length && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + 60)}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Load More
          </button>
        </div>
      )}

      {
        modaldata && <ConfirmationModal modaldata={modaldata}/>

      }
    </div>
  );
};

export default ApprovalPage;
