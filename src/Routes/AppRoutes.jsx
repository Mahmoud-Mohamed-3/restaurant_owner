import {Route, Routes} from "react-router-dom";
import Login from "../Pages/Login.jsx";
import HomePageLayout from "../Pages/HomePageLayout.jsx";
import OverallStats from "../componenets/ResStats.jsx";
import CategoryStats from "../componenets/CategoryStats.jsx";
import UserStats from "../componenets/UserStats.jsx";
import ReservationsStats from "../componenets/ReservationsStats.jsx";
import ManageCategories from "../componenets/ManageCategories.jsx";
import ManageTables from "../componenets/ManageTables.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path={'/login'} element={<Login/>}/>
      <Route element={<HomePageLayout/>}>
        <Route path={'/'} element={<OverallStats/>}/>
        <Route path={'/category_stats'} element={<CategoryStats/>}/>
        <Route path={'/user_stats'} element={<UserStats/>}/>
        <Route path={'/reservations_stats'} element={<ReservationsStats/>}/>
        <Route path={'/categories'} element={<ManageCategories/>}/>
        <Route path={'/tables'} element={<ManageTables/>}/>
      </Route>
    </Routes>
  )
}