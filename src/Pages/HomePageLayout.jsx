import SideBar from "../componenets/SideBar.jsx";
import {Outlet} from "react-router-dom";
import "../css/home_page_layout.css"

export default function HomePageLayout() {
  return (
    <div className={"HomePageLayout"}>
      <SideBar/>
      <div className={"OutletContainer"}>
        <Outlet/>
      </div>
    </div>
  )
}