import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LuMoon, LuSun } from "react-icons/lu";
import { toggleTheme } from "../../Slices/uiSlices";
import { toast } from "react-toastify";

export default function DarkModeToggle() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.ui.theme);
  const isDark = theme === "dark";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", theme);
  }, [isDark, theme]);

  return (
    <button
      type="button"
      onClick={() => {
        dispatch(toggleTheme());
        toast.info(`${isDark ? "Light" : "Dark"} mode enabled`);
      }}
      className="mx-4 mt-auto flex items-center justify-between rounded-lg border border-zinc-700 px-3 py-2 text-sm font-medium text-gray-200 transition hover:bg-zinc-700"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span>{isDark ? "Dark Mode" : "Light Mode"}</span>
      {isDark ? <LuMoon /> : <LuSun />}
    </button>
  );
}
