import "../css/sidebar.css";
import {NavLink} from "react-router-dom";
import {useEffect} from "react";
import {useCookies} from "react-cookie";
import axios from "axios";
import {notification} from "antd";

export default function SideBar() {
  const [cookies, setCookies, removeCookie] = useCookies();
  useEffect(() => {
    if (!cookies.jwt) {
      window.location.href = "/login";
    }
  })
  const handleLogout = async () => {
    try {
      const response = await axios.delete('http://127.0.0.1:3000/owners/sign_out', {
        headers: {
          Authorization: `${cookies.jwt}`,
        },
      })
      if (response.status === 200) {
        removeCookie("jwt");
        notification.success({message: "Logged out successfully"});
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
      }
    } catch (error) {
      console.error("Failed to logout", error);
    }

  }
  return (
    <div className="SideBarContainer">
      <div className="Title">
        <h1>Dashboard</h1>
      </div>
      <div className="Links">
        <div className="Link">
          <NavLink to="/" className={({isActive}) => isActive ? "activeLink" : ""}>
            Overall Stats
          </NavLink>
        </div>
        <div className="Link">
          <NavLink to="/category_stats" className={({isActive}) => isActive ? "activeLink" : ""}>
            Categories Stats
          </NavLink>
        </div>
        <div className="Link">
          <NavLink to="/user_stats" className={({isActive}) => isActive ? "activeLink" : ""}>
            Users Stats
          </NavLink>
        </div>
        <div className="Link">
          <NavLink to="/reservations_stats" className={({isActive}) => isActive ? "activeLink" : ""}>
            Reservations Stats
          </NavLink>
        </div>
        <div className="Link">
          <NavLink to="/categories" className={({isActive}) => isActive ? "activeLink" : ""}>
            Manage Categories
          </NavLink>
        </div>
        <div className="Link">
          <NavLink to="/tables" className={({isActive}) => isActive ? "activeLink" : ""}>
            Manage Tables
          </NavLink>
        </div>
      </div>
      <div className="Actions">
        <button className="LogoutBtn" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}
