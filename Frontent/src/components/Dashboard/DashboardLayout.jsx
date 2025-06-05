import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./SidebarDashBoard";
import DashboardHeader from "./DashboardHeader";
import "./Sidebar.scss";
import useIsMobile from "../CustomHook/useIsmobile";
const DashboardLayout = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const onToggleSidebar=() => setShowSidebar((pre=>!pre));
const ismobile=useIsMobile();
  return (
    <div className="dashboard-layout d-flex">
<Sidebar
  isSidebarOpen={showSidebar}
  toggleSidebar={onToggleSidebar}
  isMobile={ismobile} // ✅ Pass the isMobile prop
/>
<div className="main-content flex-grow-1 d-flex flex-column">
       <DashboardHeader toggleSidebar={onToggleSidebar} isMobile={ismobile} />
 <main className=" w-100 flex-grow-1  overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;