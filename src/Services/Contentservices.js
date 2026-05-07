import { apiconnector } from "./Apiconnector";

// ─── Teacher ───────────────────────────────────────────

// GET /content and filter by teacherId.
// json-server compares query params by type, but existing data has mixed
// string/number teacherId values. Normalize here so every teacher sees only
// their own content.
export const getMyContent = async (teacherId) => {
  const res = await apiconnector("GET", "/content");
  const normalizedTeacherId = String(teacherId);

  return {
    ...res,
    data: res.data.filter(
      (item) => String(item.teacherId) === normalizedTeacherId,
    ),
  };
};

// POST /content
export const uploadContent = (data) => apiconnector("POST", "/content", data);

// DELETE /content/1
export const deleteContent = (id) => apiconnector("DELETE", `/content/${id}`);

// ─── Principal ─────────────────────────────────────────

// GET /content
export const getAllContent = () => apiconnector("GET", "/content");

// GET /content?status=pending
export const getPendingContent = () =>
  apiconnector(
    "GET",
    "/content",
    null,
    {},
    {
      status: "pending",
    },
  );

// ─── Live Page (Public) ────────────────────────────────

// GET approved live content for a teacher
export const getLiveContent = async (teacherId) => {
  const res = await apiconnector(
    "GET",
    "/content",
    null,
    {},
    {
      status: "approved",
    },
  );
  const normalizedTeacherId = String(teacherId);

  return {
    ...res,
    data: res.data.filter(
      (item) => String(item.teacherId) === normalizedTeacherId,
    ),
  };
};
