import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faBackward } from "@fortawesome/free-solid-svg-icons";
import { updateUserInfo } from "../../backendCalls/userInfo";
import toast from "react-hot-toast";

const EditUserModal = ({ user, onSuccess, onCancel }) => {
  const [editFormData, setEditFormData] = useState({
    fullname: user?.fullname || "",
    username: user?.username || "",
    password: "",
    role: user?.role?.rolename || "",
  });
  const [isEditUpdating, setIsEditUpdating] = useState(false);

  const positions = [
    "Salesman",
    "Warehouse keeper",
    "Delivery staff",
    "System admin",
  ];

  const getRoleIdFromName = (roleName) => {
    switch (roleName) {
      case "Salesman":
        return 3;
      case "Warehouse keeper":
        return 4;
      case "Delivery staff":
        return 5;
      case "System admin":
        return 1;
      default:
        return null;
    }
  };

  const handleEditFormChange = (field, value) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveEdit = async () => {
    if (!user) return;
    setIsEditUpdating(true);
    try {
      const updatedUserData = {
        ...user,
        username: editFormData.username,
        // Chỉ gửi password nếu nhập
        ...(editFormData.password &&
          editFormData.password.trim() !== "" && {
            password: editFormData.password,
          }),
        roleid: getRoleIdFromName(editFormData.role),
      };

      delete updatedUserData.role;

      const response = await updateUserInfo(updatedUserData);
      if (response.status === 200) {
        const updatedUser = {
          ...user,
          username: editFormData.username,
          role: { ...user.role, rolename: editFormData.role },
        };
        onSuccess(updatedUser);
        toast.success("Cập nhật thông tin thành công!");
      } else {
        toast.error("Có lỗi xảy ra khi cập nhật thông tin!");
      }
    } catch (error) {
      console.error("Error updating user info:", error);
      toast.error("Có lỗi xảy ra khi cập nhật thông tin!");
    } finally {
      setIsEditUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-200 rounded-lg p-6 max-w-4xl w-full mx-4 relative">
        <div className="flex items-start gap-8">
          <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            {/* Role */}
            <div className="w-40">
              <select
                value={editFormData.role}
                onChange={(e) => handleEditFormChange("role", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">Chọn vị trí</option>
                {positions.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Data */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-4">
              <label className="w-32 text-sm font-medium text-gray-700">
                MÃ NHÂN VIÊN:
              </label>
              <input
                type="text"
                value={user?.id || ""}
                disabled
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 text-sm font-medium text-gray-700">
                TÊN NHÂN VIÊN:
              </label>
              <input
                type="text"
                value={editFormData.fullname}
                disabled
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 text-sm font-medium text-gray-700">
                TÊN ĐĂNG NHẬP:
              </label>
              <input
                type="text"
                value={editFormData.username}
                onChange={(e) =>
                  handleEditFormChange("username", e.target.value)
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 text-sm font-medium text-gray-700">
                MẬT KHẨU:
              </label>
              <input
                type="password"
                value={editFormData.password}
                onChange={(e) =>
                  handleEditFormChange("password", e.target.value)
                }
                placeholder="Để trống nếu không muốn thay đổi"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleSaveEdit}
              disabled={isEditUpdating}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 min-w-[100px]"
            >
              <FontAwesomeIcon icon={faSave} />
              <span>{isEditUpdating ? "Đang lưu..." : "Lưu"}</span>
            </button>
            <button
              onClick={onCancel}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 min-w-[100px]"
            >
              <FontAwesomeIcon icon={faBackward} />
              <span>Quay lại</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
