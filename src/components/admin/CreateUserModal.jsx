import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faBackward,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { createNewUser, updateUserInfo } from "../../backendCalls/userInfo";
import toast from "react-hot-toast";

const CreateUserModal = ({ users, onSuccess, onCancel }) => {
  const [createFormData, setCreateFormData] = useState({
    fullname: "",
    username: "",
    password: "",
    role: "",
    status: 0, // mặc định acc mới inactive
  });
  const [isCreating, setIsCreating] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRoleConflictModal, setShowRoleConflictModal] = useState(false);
  const [conflictingUser, setConflictingUser] = useState(null);

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

  const validatePassword = (password) => {
    if (password === "") return "";
    if (password.length < 8 || password.length > 30) {
      return "Mật khẩu phải từ 8 đến 30 ký tự.";
    } else if (!/^(?=.*\d)(?=.*[a-zA-Z]).*$/.test(password)) {
      return "Mật khẩu phải chứa cả chữ và số.";
    } else if (/[^a-zA-Z0-9]/.test(password)) {
      return "Mật khẩu chỉ được chứa chữ cái và số, không có ký tự đặc biệt.";
    }
    return "";
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

  const findActiveUserByRole = (roleName) => {
    return users.find(
      (user) => user?.role?.rolename === roleName && user?.status === "1"
    );
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
    if (field === "password") {
      const error = validatePassword(value);
      setPasswordError(error);
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
    if (emailError || passwordError) {
      toast.error("Vui lòng kiểm tra lại thông tin!");
      return;
    }
    // Check role conflict
    if (
      createFormData.role === "Warehouse keeper" ||
      createFormData.role === "Delivery staff"
    ) {
      const activeUser = findActiveUserByRole(createFormData.role);
      if (activeUser) {
        setConflictingUser(activeUser);
        setShowRoleConflictModal(true);
        return;
      }
    }
    await createUserWithStatus(1); // Default status
  };

  const createUserWithStatus = async (status) => {
    setIsCreating(true);
    try {
      const newUserData = {
        fullname: createFormData.fullname,
        username: createFormData.username,
        password: createFormData.password,
        roleid: getRoleIdFromName(createFormData.role),
        status: status,
      };
      const response = await createNewUser(newUserData);
      console.log("New User Data:", newUserData);
      console.log("Response:", response);
      if (response.status === 200 || response.status === 201) {
        toast.success("Tạo tài khoản thành công!");
        onSuccess();
      } else if (response.status === 409) {
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

  const handleRoleConflictConfirm = async () => {
    if (conflictingUser) {
      try {
        // Deactive acc confict
        const deactivateResponse = await updateUserInfo({
          ...conflictingUser,
          status: "0", // Deactive user cũ
        });
        if (deactivateResponse.status !== 200) {
          toast.error("Có lỗi xảy ra khi cập nhật trạng thái!");
          setShowRoleConflictModal(false);
          setConflictingUser(null);
          return;
        }
      } catch (error) {
        console.error("Error deactivating conflicting user:", error);
        toast.error("Có lỗi xảy ra khi cập nhật trạng thái!");
        setShowRoleConflictModal(false);
        setConflictingUser(null);
        return;
      }
    }
    setShowRoleConflictModal(false);
    setConflictingUser(null);
    // Tạo user mới với trạng thái active
    await createUserWithStatus(1);
  };

  const handleCancelRoleConflict = () => {
    setShowRoleConflictModal(false);
    setConflictingUser(null);
  };

  return (
    <>
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
                  value={createFormData.role}
                  onChange={(e) =>
                    handleCreateFormChange("role", e.target.value)
                  }
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
                    autoComplete="off"
                    placeholder="example@email.com"
                    type="text"
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
                <div className="flex-1">
                  <div className="relative">
                    <input
                      autoComplete="off"
                      type={showPassword ? "text" : "text"}
                      value={createFormData.password}
                      onChange={(e) =>
                        handleCreateFormChange("password", e.target.value)
                      }
                      className={`w-full px-3 py-2 pr-10 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        passwordError ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Nhập mật khẩu"
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
                onClick={handleCreateUser}
                disabled={isCreating || emailError || passwordError}
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
      {/* MODAL conflict vị trí */}
      {showRoleConflictModal && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-gray-300 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Xác nhận tạo tài khoản
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Hệ thống hiện đang có{" "}
              <span className="font-medium text-gray-900">
                {conflictingUser?.fullname}
              </span>{" "}
              với vị trí{" "}
              <span className="font-medium text-gray-900">
                {createFormData.role}
              </span>{" "}
              ở trạng thái Active. Khi tạo tài khoản mới, hệ thống sẽ tự động
              deactive tài khoản cũ và active tài khoản mới.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelRoleConflict}
                disabled={isCreating}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleRoleConflictConfirm}
                disabled={isCreating}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isCreating ? "Đang tạo..." : "Xác nhận"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateUserModal;
