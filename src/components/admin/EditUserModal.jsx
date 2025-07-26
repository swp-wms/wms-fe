import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faBackward,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { updateUserInfo } from "../../backendCalls/userInfo";
import toast from "react-hot-toast";

const EditUserModal = ({ user, onSuccess, onCancel }) => {
  const [editFormData, setEditFormData] = useState({
    password: "",
    role: user?.role?.rolename || "",
  });
  const [isEditUpdating, setIsEditUpdating] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

  const validatePassword = (password) => {
    // Check khi nhập mk
    if (password === "") return "";
    if (password.length < 8 || password.length > 30) {
      return "Mật khẩu phải từ 8 đến 30 ký tự.";
    } else if (!/^[a-zA-Z0-9]+$/.test(password)) {
      return "Mật khẩu chỉ được chứa chữ cái và số, không có ký tự đặc biệt.";
    } else if (!/(?=.*[a-zA-Z])/.test(password)) {
      return "Mật khẩu phải chứa ít nhất một chữ cái.";
    } else if (!/(?=.*[0-9])/.test(password)) {
      return "Mật khẩu phải chứa ít nhất một chữ số.";
    }
    return "";
  };

  const handleEditFormChange = (field, value) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (field === "password") {
      const error = validatePassword(value);
      setPasswordError(error);
    }
  };

  const handleSaveEdit = async () => {
    if (!user) return;
    if (!editFormData.role) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    if (passwordError) {
      toast.error("Vui lòng kiểm tra lại thông tin!");
      return;
    }

    setIsEditUpdating(true);
    try {
      const updatedUserData = {
        ...user,
        ...(editFormData.password && { password: editFormData.password }),
        role: getRoleIdFromName(editFormData.role),
      };
      const response = await updateUserInfo(updatedUserData);
      if (response.status === 200) {
        const updatedUser = {
          ...user,
          ...updatedUserData,
          role: { ...user.role, rolename: editFormData.role },
        };
        onSuccess(updatedUser);
        toast.success("Cập nhật thông tin thành công!");
      } else if (response.status === 400) {
        toast.error("Có lỗi xảy ra khi cập nhật thông tin!");
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
            {/* ROLE */}
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
          {/* DATA */}
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
                value={user?.fullname || ""}
                disabled
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 text-sm font-medium text-gray-700">
                TÊN ĐĂNG NHẬP:
              </label>
              <input
                type="email"
                value={user?.username || ""}
                disabled
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 text-sm font-medium text-gray-700">
                MẬT KHẨU:
              </label>
              <div className="flex-1">
                <div className="relative">
                  <input
                    autoComplete="off"
                    type={showPassword ? "text" : "password"}
                    value={editFormData.password}
                    onChange={(e) =>
                      handleEditFormChange("password", e.target.value)
                    }
                    placeholder="Để trống nếu không muốn thay đổi"
                    className={`w-full px-3 py-2 pr-10 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      passwordError ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <FontAwesomeIcon
                      icon={showPassword ? faEyeSlash : faEye}
                      className="h-4 w-4"
                    />
                  </button>
                </div>
                {passwordError && (
                  <p className="text-red-500 text-xs mt-1">{passwordError}</p>
                )}
              </div>
            </div>
          </div>
          {/* BTNS */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleSaveEdit}
              disabled={isEditUpdating || passwordError}
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
