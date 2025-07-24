import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faCircleUser,
  faPowerOff,
} from "@fortawesome/free-solid-svg-icons";
import { handleLogout } from "../../backendCalls/user";
import sideElement from "../../data/sideElements";

const Sidebar = ({ user, setUser, setPath }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = async () => {
    await handleLogout();
    setUser(null);
    navigate("/dang-nhap");
  };
  return (
    <div className="flex flex-col h-screen w-[300px] bg-white px-6 shadow-lg justify-between">
      <div>
        <div className="flex flex-row items-center justify-between py-4 ">
          <img src="/logo.png" className="w-1/2" />
          <FontAwesomeIcon icon={faBars} className="w-1/5" />
        </div>
        <hr className="opacity-10" />
        <ul className="flex flex-col gap-2 mt-8">
          {sideElement.map((item) => {
            if (item.allowed.includes(user.roleid)) {
              return (
                <Link to={item.path} key={item.id}>
                  <li
                    onClick={() => setPath(item.name)}
                    className={`text-gray-600 py-2 hover-btn ${
                      location.pathname === item.path ? "selected-btn" : ""
                    }`}
                  >
                    <FontAwesomeIcon icon={item.icon} className="w-1/5" />
                    {item.name}
                  </li>
                </Link>
              );
            }
          })}
        </ul>
      </div>

      <div className="mb-4 flex flex-row items-center justify-between">
        <div className="flex flex-row rounded-full bg-white shadow-btn p-2 w-fit justify-between items-center gap-2">
          <FontAwesomeIcon icon={faCircleUser} size="xl" />
          <span className="px-3 font-medium">{user.role.rolename}</span>
        </div>
        <div className="rounded-full bg-red-500 size-8 flex items-center justify-center shadow-btn">
          <FontAwesomeIcon
            icon={faPowerOff}
            onClick={logout}
            title="Logout"
            className="hover:cursor-pointer"
            color="white"
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
