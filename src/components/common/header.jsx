import React from "react";
import Sidebar from "./sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDoorOpen,
  faBell,
  faGear,
} from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  return (
    <section className="flex flex-row fixed w-full">
      <Sidebar />
      <div className="w-full">
        <NavBar />
        <hr className="opacity-20" />
      </div>
    </section>
  );
};

const NavBar = () => {
  return (
    <div className="flex flex-row justify-between py-4.5 px-8">
      <div className="flex flex-row gap-4 items-center opacity-50">
        <FontAwesomeIcon icon={faDoorOpen} size="lg" />
        <span className=" text-gray-600 py-2 font-medium">Tổng quan kho</span>
      </div>
      <div className="flex flex-row gap-8 items-center">
        <FontAwesomeIcon icon={faBell} size="lg" />
        <FontAwesomeIcon icon={faGear} size="lg" />
        <div className="flex flex-row rounded-full bg-white shadow-btn p-1.5 w-fit justify-between items-center gap-2">
          <div className="size-8 rounded-full bg-gray-200"></div>
          <span className="px-3 font-medium">Ngoc Mai</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
