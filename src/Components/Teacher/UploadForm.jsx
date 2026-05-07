import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { uploadContentThunk } from "../../Slices/contentSlice";
import { selectUser } from "../../Slices/authSlice";

// ── Zod Schema ──────────────────────────────────────────
const uploadSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required")
      .min(3, "Title must be at least 3 characters"),
    subject: z.string().min(1, "Subject is required"),
    description: z
      .string()
      .min(1, "Description is required")
      .min(10, "Description must be at least 10 characters"),
    fileUrl: z.string().min(1, "Please select an image"), // ✅ updated message
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    rotationDuration: z
      .number({ invalid_type_error: "Must be a number" })
      .min(5, "Minimum 5 seconds")
      .max(300, "Maximum 300 seconds"),
  })
  .refine((data) => new Date(data.endTime) > new Date(data.startTime), {
    message: "End time must be after start time",
    path: ["endTime"],
  });

const SUBJECTS = [
  "Mathematics",
  "Science",
  "English",
  "History",
  "Geography",
  "Biology",
  "Chemistry",
  "Physics",
];

export default function UploadForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const uploadStatus = useSelector((state) => state.content.uploadStatus);

  // ── Image Preview State ─────────────────────────────
  const [preview, setPreview] = useState(null);
  const [fileError, setFileError] = useState("");

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const {
    register,
    handleSubmit,
    reset,
    setValue, // ✅ added
    formState: { errors },
  } = useForm({
    resolver: zodResolver(uploadSchema),
    defaultValues: { rotationDuration: 30 },
  });

  // ── Handle File Pick ────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate type
    if (!file.type.startsWith("image/")) {
      setFileError("Please select an image file (PNG, JPG, WEBP)");
      return;
    }

    // Validate size — max 2MB
    if (file.size > 2 * 1024 * 1024) {
      setFileError("Image size must be under 2MB");
      return;
    }

    setFileError("");

    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setPreview(URL.createObjectURL(file));

    // Convert to base64 so it can be stored in db.json and shown on LivePage
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setValue("fileUrl", base64, { shouldValidate: true }); // ✅ inject into form
    };
    reader.readAsDataURL(file);
  };

  // ── Submit ──────────────────────────────────────────
  const onSubmit = async (formData) => {
    if (!user?.id || user.role !== "teacher") {
      navigate("/login");
      return;
    }

    const payload = {
      ...formData,
      teacherId: user.id,
      teacherName: user.name,
      status: "pending",
      rejectionReason: null,
      approvedBy: null,
      approvedAt: null,
    };

    const result = await dispatch(uploadContentThunk(payload));

    if (uploadContentThunk.fulfilled.match(result)) {
      reset();
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
      setPreview(null); // ✅ clear preview
      navigate("/teacher/my-content");
    }
  };

  const isLoading = uploadStatus === "uploading";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* ── Title ──────────────────────────────────────── */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Math Lecture - Chapter 3"
          {...register("title")}
          className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 transition
            ${errors.title ? "border-red-400" : "border-gray-300"}`}
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* ── Subject ────────────────────────────────────── */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Subject <span className="text-red-500">*</span>
        </label>
        <select
          {...register("subject")}
          className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 transition bg-white
            ${errors.subject ? "border-red-400" : "border-gray-300"}`}
        >
          <option value="">Select a subject</option>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {errors.subject && (
          <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>
        )}
      </div>

      {/* ── Description ────────────────────────────────── */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={3}
          placeholder="Brief description of the content..."
          {...register("description")}
          className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 transition resize-none
            ${errors.description ? "border-red-400" : "border-gray-300"}`}
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* ── Image Upload ───────────────────────────────── */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Content Image <span className="text-red-500">*</span>
        </label>

        {/* Hidden input for react-hook-form validation */}
        <input type="hidden" {...register("fileUrl")} />

        {/* Dropzone */}
        <div
          onClick={() => document.getElementById("fileInput").click()}
          className={`w-full border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition overflow-hidden
            ${errors.fileUrl || fileError ? "border-red-400" : "border-gray-300"}`}
        >
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {preview ? (
            // ── Preview ────────────────────────────────
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full max-h-56 object-contain bg-gray-50 p-2"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-xs text-center py-1.5">
                Click to change image
              </div>
            </div>
          ) : (
            // ── Placeholder ────────────────────────────
            <div className="flex flex-col items-center justify-center py-10 space-y-2 text-center px-4">
              <span className="text-4xl">🖼️</span>
              <p className="text-sm font-medium text-gray-600">
                Click to choose an image
              </p>
              <p className="text-xs text-gray-400">
                PNG, JPG, JPEG, WEBP — max 2MB
              </p>
            </div>
          )}
        </div>

        {/* Errors */}
        {fileError && <p className="text-red-500 text-xs mt-1">{fileError}</p>}
        {errors.fileUrl && !fileError && (
          <p className="text-red-500 text-xs mt-1">{errors.fileUrl.message}</p>
        )}
      </div>

      {/* ── Start & End Time ───────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Time <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            {...register("startTime")}
            className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 transition
              ${errors.startTime ? "border-red-400" : "border-gray-300"}`}
          />
          {errors.startTime && (
            <p className="text-red-500 text-xs mt-1">
              {errors.startTime.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Time <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            {...register("endTime")}
            className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 transition
              ${errors.endTime ? "border-red-400" : "border-gray-300"}`}
          />
          {errors.endTime && (
            <p className="text-red-500 text-xs mt-1">
              {errors.endTime.message}
            </p>
          )}
        </div>
      </div>

      {/* ── Rotation Duration ──────────────────────────── */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Rotation Duration (seconds) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          placeholder="30"
          {...register("rotationDuration", { valueAsNumber: true })}
          className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 transition
            ${errors.rotationDuration ? "border-red-400" : "border-gray-300"}`}
        />
        <p className="text-gray-400 text-xs mt-1">
          How long this content displays on the live screen (5–300 seconds)
        </p>
        {errors.rotationDuration && (
          <p className="text-red-500 text-xs mt-1">
            {errors.rotationDuration.message}
          </p>
        )}
      </div>

      {/* ── Actions ────────────────────────────────────── */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition"
        >
          {isLoading ? "Uploading..." : "Submit for Approval"}
        </button>
        <button
          type="button"
          onClick={() => navigate("/teacher/my-content")}
          className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium px-6 py-2.5 rounded-lg transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
