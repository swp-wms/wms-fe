import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faBackward } from "@fortawesome/free-solid-svg-icons";
import { createNewUser } from "../../backendCalls/userInfo";
import toast from "react-hot-toast";

const CreateUserModal = ({ onSuccess, onCancel }) => {
  const [createFormData, setCreateFormData] = useState({
    fullname: "",
    username: "",
    password: "",
    role: "",
  });
  const [isCreating, setIsCreating] = useState(false);
  const [emailError, setEmailError] = useState("");

  const positions = [
    "Salesman",
    "Warehouse keeper",
    "Delivery staff",
    "System admin",
  ];

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

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

  const handleCreateFormChange = (field, value) => {
    setCreateFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (field === "username") {
      if (value && !validateEmail(value)) {
        setEmailError("Tên đăng nhập phải có định dạng email hợp lệ");
      } else {
        setEmailError("");
      }
    }
  };

  const handleCreateUser = async () => {
    if (
      !createFormData.fullname ||
      !createFormData.username ||
      !createFormData.password ||
      !createFormData.role
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    // if (!validateEmail(createFormData.username)) {
    //   toast.error("Tên đăng nhập phải có định dạng email hehehehehe!");
    //   return;
    // }
    // Check emailError => disable nút CF

    setIsCreating(true);
    try {
      const newUserData = {
        fullname: createFormData.fullname,
        username: createFormData.username,
        password: createFormData.password,
        roleid: getRoleIdFromName(createFormData.role),
      };
      const response = await createNewUser(newUserData);

      console.log("New User Data:", newUserData);
      console.log("Response:", response);

      if (response.status === 200 || response.status === 201) {
        toast.success("Tạo tài khoản thành công!");
        onSuccess();
      } 
      //Kiểm tra email tồn tại
      else if (response.status === 409) {
        toast.error("TÊN ĐĂNG NHẬP đã tồn tại!");
      } else {
        toast.error("Có lỗi xảy ra khi tạo tài khoản!");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Có lỗi xảy ra khi tạo tài khoản!");
    } finally {
      setIsCreating(false);
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
            {/* Roles */}
            <div className="w-40">
              <select
                value={createFormData.role}
                onChange={(e) => handleCreateFormChange("role", e.target.value)}
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
                TÊN NHÂN VIÊN:
              </label>
              <input
                type="text"
                value={createFormData.fullname}
                onChange={(e) =>
                  handleCreateFormChange("fullname", e.target.value)
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập tên nhân viên"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 text-sm font-medium text-gray-700">
                TÊN ĐĂNG NHẬP:
              </label>
              <div className="flex-1">
                <input
                  placeholder="example@email.com"
                  type="email"
                  value={createFormData.username}
                  onChange={(e) =>
                    handleCreateFormChange("username", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    emailError ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {emailError && (
                  <p className="text-red-500 text-xs mt-1">{emailError}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 text-sm font-medium text-gray-700">
                MẬT KHẨU:
              </label>
              <input
                type="password"
                value={createFormData.password}
                onChange={(e) =>
                  handleCreateFormChange("password", e.target.value)
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập mật khẩu"
              />
            </div>
          </div>
          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleCreateUser}
              disabled={isCreating || emailError}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 min-w-[100px]"
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>{isCreating ? "Đang tạo..." : "Tạo"}</span>
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

export default CreateUserModal;
