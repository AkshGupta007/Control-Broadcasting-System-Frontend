import clsx from "clsx";
import React from "react";

import { NavLink } from "react-router-dom";

const SidebarLink = ({ link}) => {
 

  if (!link || !link.path) return null;

  return (
    <NavLink
      to={link.path}
      end={false}
      className={({ isActive }) =>
        clsx(
          "relative flex items-center gap-x-2 px-6 py-2 text-sm font-medium rounded-md transition-colors duration-200 w-full",
          isActive
            ? "bg-yellow-700 text-black"
            : "text-gray-300 hover:bg-zinc-700 hover:text-white",
        )
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={clsx(
              "absolute left-0 top-0 h-full w-[0.2rem] bg-red-600 transition-opacity",
              isActive ? "opacity-100" : "opacity-0",
            )}
          ></span>

        
          <span>{link.name}</span>
        </>
      )}
    </NavLink>
  );
};

export default SidebarLink;
