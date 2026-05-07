import React, { useState } from "react";

import ConfirmationModal from "./ConfirmationModal";

import SidebarLink from "./SidebarLinks";
import DarkModeToggle from "./DarkModeToggle";

import { LuLogOut } from "react-icons/lu";

import { logout } from "../../Slices/authSlice";

import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

const sidebarLinks = [
  {
    id: 2,
    name: "Teacher Dashboard",
    path: "/teacher/dashboard",
    role: "teacher",
  },
  {
    id: 3,
    name: "Upload Content",
    path: "/teacher/upload",
    role: "teacher",
  },
  {
    id: 4,
    name: "My Content",
    path: "/teacher/my-content",
    role: "teacher",
  },
  {
    id: 5,
    name: "Principal Dashboard",
    path: "/principal/dashboard",
    role: "principal",
  },
  {
    id: 6,
    name: "Approvals",
    path: "/principal/approvals",
    role: "principal",
  },
  {
    id: 7,
    name: "All Content",
    path: "/principal/content",
    role: "principal",
  },
//   {
//     id: 8,
//     name: "Live Class",
//     path: "/live/:teacherId",
//     role: "public",
//   },
];

const Sidebar = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const [modal, setmodal] = useState(null);

  return (
    <div className="text-white">
      <div className="flex flex-col border-r h-screen bg-zinc-800 py-10 min-w-[222px]">
        {/* SIDEBAR LINKS */}

        <div className="flex flex-col gap-3">
          {sidebarLinks.map((link) => {
            if (link.role !== "public" && user?.role !== link.role) {
              return null;
            }

            return (
              <div key={link.id}>
                <SidebarLink link={link} />
              </div>
            );
          })}
        </div>

        <DarkModeToggle />

        {/* LOGOUT */}

        <button
          className="mt-4 px-4 flex items-center text-gray-200 hover:text-white"
          onClick={() =>
            setmodal({
              text1: "ARE YOU SURE?",
              text2: "YOU WILL BE LOGGED OUT",

              btn1text: "LOGOUT",

              btn2text: "CANCEL",

              btn1handler: () => {
                dispatch(logout());

                navigate("/");
              },

              btn2handler: () => setmodal(null),
            })
          }
        >
          <LuLogOut className="mr-2" />
          LOGOUT
        </button>
      </div>

      {/* MODAL */}

      {modal && <ConfirmationModal modaldata={modal} />}
    </div>
  );
};

export default Sidebar;
