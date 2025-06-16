import React from "react";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import getUserInfo from "../../backendCalls/userInfo";
import { useEffect } from "react";
import { updateUserInfo } from "../../backendCalls/userInfo";

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

  useEffect(() => {
    const fetchUserInfo = async () => {
      let response = await getUserInfo();
      console.log("check useeffect", response);
      setUser(response.data);
    };
    fetchUserInfo();
  }, []);

  let [edit, setEdit] = useState(false);

  const handleEditInfoButton = async () => {
    console.log("Edit: ", edit);
    setEdit(!edit);
  };

  const handleSaveInfoButton = async () => {
    await updateUserInfo(user);
    console.log("User: ", user);
    setEdit(false);
  };

  let [editPassWord, setEditPassWord] = useState(false);
  const handleEditPassWordButton = async () => {
    console.log("Edit: ", editPassWord);
    setEditPassWord(!editPassWord);
  };

  return (
    <div className="flex gap-6 p-6 max-w-6xl mt-24 ml-80 ">
      {/* Div edit */}
      <div className={edit ? "flex" : "hidden"}>
        <div className="border border-gray-300 rounded-lg p-6 w-124 bg-white border-2 shadow-2xs">
          <div className="flex flex-row justify-between">
            <div className="justify-start">
              <button className="p-2 hover:bg-gray-100 rounded">
                <FontAwesomeIcon
                  onClick={() => handleEditInfoButton()}
                  icon={faArrowLeftLong}
                  className="text-lg text-gray-600"
                />
              </button>
            </div>

            <div className="justify-end">
              <button className="p-2 hover:bg-gray-100 rounded">
                <FontAwesomeIcon
                  onClick={() => handleSaveInfoButton()}
                  icon={faDownload}
                  className="text-lg text-gray-600"
                />
              </button>
            </div>
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
                readOnly={!edit}
                onChange={(e) => setUser({ ...user, fullname: e.target.value })}
                className="flex-1 ml-2 h-8 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 w-32">
                Giới tính:
              </span>
              <input
                value={user.gender}
                readOnly={!edit}
                onChange={(e) => setUser({ ...user, gender: e.target.value })}
                className="flex-1 ml-2 h-8 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 w-32">
                Ngày sinh:
              </span>
              <input
                value={user.dateofbirth}
                readOnly={!edit}
                onChange={(e) =>
                  setUser({ ...user, dateofbirth: e.target.value })
                }
                className="flex-1 ml-2 h-8 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 w-32">
                Số điện thoại:
              </span>
              <input
                value={user.phonenumber}
                readOnly={!edit}
                onChange={(e) =>
                  setUser({ ...user, phonenumber: e.target.value })
                }
                className="flex-1 ml-2 h-8 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 w-32">
                Email:
              </span>
              <input
                value={user.username}
                readOnly={!edit}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                className="flex-1 ml-2 h-8 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 w-32">
                Địa chỉ:
              </span>
              <input
                value={user.address}
                readOnly={!edit}
                onChange={(e) => setUser({ ...user, address: e.target.value })}
                className="flex-1 ml-2 h-8 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* User Profile */}
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

      {/* Right Panel */}
      <div className="flex flex-col gap-4 flex-1">
        {/* Login Credentials Section */}
        <div className="border border-gray-300 rounded-lg p-4 bg-white border-2 shadow-2xs">
          <div className="space-y-3">
            <div className="flex items-center gap-6">
              <span className="text-sm font-medium text-gray-700 w-32">
                TÊN ĐĂNG NHẬP:
              </span>
              <input
                value={user.username}
                readOnly
                className="flex-1 h-8 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-6">
              <span className="text-sm font-medium text-gray-700 w-32">
                MẬT KHẨU:
              </span>
              <span className="text-sm text-gray-900 bg-white px-3 py-1 rounded border">
                ****************
              </span>

              <div className="flex justify-end">
                <button className="p-2 hover:bg-gray-200 rounded">
                  <FontAwesomeIcon
                    onClick={() => handleEditPassWordButton()}
                    icon={faPenToSquare}
                    className="text-lg text-gray-600"
                  />
                </button>
              </div>
            </div>
            {/* Div change password */}
            <div className={editPassWord ? "block" : "hidden"}>
              <div className="flex items-center gap-6">
                <span className="text-sm font-medium text-gray-700 w-32">
                  MẬT KHẨU MỚI:
                </span>
                <input className="text-sm text-gray-900 bg-white px-3 py-1 rounded border" />
              </div>

              <div className="flex items-center gap-6 mt-3">
                <span className="text-sm font-medium text-gray-700 w-32">
                  NHẬP LẠI MẬT KHẨU:
                </span>
                <input className="text-sm text-gray-900 bg-white px-3 py-1 rounded border" />
              </div>
              <div className="flex justify-end">
                <div className="">
                  <button className="p-2 hover:bg-gray-200 rounded mx-2">
                    <FontAwesomeIcon
                      onClick={() => handleEditPassWordButton()}
                      icon={faArrowLeftLong}
                      className="text-lg text-gray-600"
                    />
                  </button>
                </div>

                <div className="">
                  <button className="p-2 hover:bg-gray-200 rounded mx-2">
                    <FontAwesomeIcon
                      icon={faDownload}
                      className="text-lg text-gray-600"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="border border-gray-300 rounded-lg p-4 bg-white flex-1 border-2 shadow-2xs">
          <div className="mb-3">
            <span className="text-sm font-medium text-gray-700">GHI CHÚ:</span>
          </div>
          <textarea
            className="w-full h-64 p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập ghi chú..."
          />
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
