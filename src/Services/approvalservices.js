import { apiconnector } from "./Apiconnector";

// PATCH /content/1
export const approveContent = (id, principalId) =>
  apiconnector("PATCH", `/content/${id}`, {
    status: "approved",
    approvedBy: principalId,
    approvedAt: new Date().toISOString(),
    rejectionReason: null,
  });

// PATCH /content/1
export const rejectContent = (id, reason) =>
  apiconnector("PATCH", `/content/${id}`, {
    status: "rejected",
    rejectionReason: reason,
    approvedBy: null,
    approvedAt: null,
  });

// POST /approval_logs
export const logApproval = (contentId, reviewedBy, action, reason = null) =>
  apiconnector("POST", "/approval_logs", {
    contentId,
    reviewedBy,
    action,
    reason,
    timestamp: new Date().toISOString(),
  });
