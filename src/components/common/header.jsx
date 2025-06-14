import { useState } from "react";
import Sidebar from "./sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDoorOpen, faBell, faGear } from "@fortawesome/free-solid-svg-icons";

const Header = ({ user, setUser }) => {
  const [path, setPath] = useState("Trang chủ");

  return (
    <section className="flex flex-row w-full">
      <div className="fixed z-10">
        <Sidebar user={user} setUser={setUser} setPath={setPath} />
      </div>
      
      <div className="w-full fixed ps-[300px]">
        <NavBar user={user} data={path}/>
        <hr className="opacity-20" />
      </div>
    </section>
  );
};

const NavBar = ({ user, data }) => {
  return (
    <div className="flex flex-row justify-between py-5.5 px-8 bg-[#fafafa]">
      <div className="flex flex-row gap-4 items-center opacity-50">
        <FontAwesomeIcon icon={faDoorOpen} size="lg" />
        <span className=" text-gray-600 py-2 font-medium">{data}</span>
      </div>
      <div className="flex flex-row gap-8 items-center">
        <FontAwesomeIcon icon={faBell} size="lg" />
        <FontAwesomeIcon icon={faGear} size="lg" />
        <div className="flex flex-row rounded-full bg-white shadow-btn p-1.5 w-fit justify-between items-center gap-2">
          <div className="size-8 rounded-full bg-gray-200"></div>
          <span className="px-3 font-medium">{user.username}</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
