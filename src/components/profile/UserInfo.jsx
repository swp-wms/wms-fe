import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import getUserInfo from "../../backendCalls/userInfo";
import { useEffect } from "react";
import { updateUserInfo } from "../../backendCalls/userInfo";
import EditProfile from "./EditProfile";
import ChangePassword from "./ChangePassword";

const UserInfo = () => {
  const [user, setUser] = useState({
    id: 0,
    username: "",
    password: "",
    roleid: 0,
    fullname: "",
    image: "",
    phonenumber: "",
    address: "",
    dateofbirth: "",
    gender: "",
  });

  const [notes, setNotes] = useState("");
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const response = await getUserInfo();
      console.log("check useeffect", response);
      setUser(response.data);
    };
    getData();

    const savedNotes = localStorage.getItem("userNotes");
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("userNotes", notes);
  }, [notes]);

  const handleEditInfoButton = async () => {
    console.log("Edit: ", edit);
    setEdit(!edit);
  };

  return (
    <div className="flex gap-6 p-6 max-w-6xl mt-24 ml-80 ">
      {/* EDIT */}
      <div className={edit ? "flex" : "hidden"}>
        <EditProfile
          user={user}
          setUser={setUser}
          updateUserInfo={updateUserInfo}
          onCancel={() => setEdit(false)}
        />
      </div>

      {/* PROFILE */}
      <div className={edit ? "hidden" : "flex"}>
        <div className="border border-gray-300 rounded-lg p-6 w-124 bg-white border-2 shadow-2xs">
          <div className="flex justify-end">
            <button className="p-2 hover:bg-gray-100 rounded">
              <FontAwesomeIcon
                onClick={() => handleEditInfoButton()}
                icon={faPenToSquare}
                className="text-lg text-gray-600"
              />
            </button>
          </div>
          <div className="flex justify-center mb-6">
            <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
              <svg
                className="w-20 h-20 text-gray-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </div>
          <div className="flex justify-center mb-8">
            <span className="text-white font-bold px-6 py-2 bg-red-700 rounded-full text-sm">
              {user.roleid == 1
                ? "System Admin"
                : user.roleid == 3
                ? "Salesman"
                : user.roleid == 4
                ? "Warehouse Keeper"
                : "Delivery Staff"}
            </span>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 w-32">
                Mã nhân viên:
              </span>
              <input
                value={user.id}
                readOnly
                className="flex-1 ml-2 h-8 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 w-32">
                Tên nhân viên:
              </span>
              <input
                value={user.fullname}
                readOnly
                className="flex-1 ml-2 h-8 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 w-32">
                Giới tính:
              </span>
              <input
                value={user.gender}
                readOnly
                className="flex-1 ml-2 h-8 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 w-32">
                Ngày sinh:
              </span>
              <input
                value={user.dateofbirth}
                readOnly
                className="flex-1 ml-2 h-8 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 w-32">
                Số điện thoại:
              </span>
              <input
                value={user.phonenumber}
                readOnly
                type="tel"
                className="flex-1 ml-2 h-8 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 w-32">
                Email:
              </span>
              <input
                value={user.username}
                readOnly
                type="email"
                className="flex-1 ml-2 h-8 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 w-32">
                Địa chỉ:
              </span>
              <input
                value={user.address}
                readOnly
                className="flex-1 ml-2 h-8 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex flex-col gap-4 flex-1">
        {/* PASSWORD CHANGE */}
        <ChangePassword user={user} updateUserInfo={updateUserInfo} />

        {/* NOTE */}
        <div className="border border-gray-300 rounded-lg p-4 bg-white flex-1 border-2 shadow-2xs">
          <div className="mb-3">
            <span className="text-sm font-medium text-gray-700">GHI CHÚ:</span>
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full h-64 p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập ghi chú..."
          />
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
