import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../Components/Common/Sidebar';
const Mainlayout = () => {
  return (
    <div className="flex relative h-screen bg-gray-50 text-gray-900 transition-colors dark:bg-gray-950 dark:text-gray-100">
      <Sidebar />
      <div className=" flex-1 overflow-auto">
        <div className="w-11/12 mx-auto  py-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Mainlayout
