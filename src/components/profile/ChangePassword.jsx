import {
  faArrowLeftLong,
  faPenToSquare,
  faDownload,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import toast from "react-hot-toast";
import bcrypt from "bcryptjs";
import { getUser } from "../../backendCalls/user";

const ChangePassword = ({ user, updateUserInfo }) => {
  const validatePassword = (password) => {
    if (password.length < 8 || password.length > 30) {
      return "Mật khẩu tối thiểu 8 ký tự. Tối đa 30 ký tự.";
    } else if (!/^(?=.*\d)(?=.*[a-zA-Z]).*$/.test(password)) {
      return "Mật khẩu phải chứa cả chữ và số.";
    }
    return "";
  };

  const [passwordErrors, setPasswordErrors] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [passwordValidationErrors, setPasswordValidationErrors] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [isVerifying, setIsVerifying] = useState(false);

  const validatePasswordRealTime = (password) => {
    if (password === "") return "";
    if (password.length < 8 || password.length > 30) {
      return "Mật khẩu tối thiểu 8 ký tự. Tối đa 30 ký tự.";
    } else if (!/^(?=.*\d)(?=.*[a-zA-Z]).*$/.test(password)) {
      return "Mật khẩu phải chứa cả chữ và số.";
    }
    return "";
  };

  const [editPassword, setEditPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleEditPasswordButton = () => {
    setEditPassword(!editPassword);
    if (!editPassword) {
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordErrors({
        current: "",
        new: "",
        confirm: "",
      });
      setPasswordValidationErrors({
        current: "",
        new: "",
        confirm: "",
      });
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const verifyCurrentPassword = async (currentPassword, hashedPassword) => {
    try {
      return await bcrypt.compare(currentPassword, hashedPassword);
    } catch (error) {
      console.error("Error comparing passwords:", error);
      return false;
    }
  };

  const handleSavePasswordButton = async () => {
    setPasswordErrors({
      current: "",
      new: "",
      confirm: "",
    });
    setIsVerifying(true);

    let hasErrors = false;

    // Kiểm tra validation
    if (
      passwordValidationErrors.current ||
      passwordValidationErrors.new ||
      passwordValidationErrors.confirm
    ) {
      toast.error("Vui lòng sửa các lỗi trước khi lưu");
      setIsVerifying(false);
      return;
    }

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      setIsVerifying(false);
      return;
    }

    // Validate mật khẩu mới
    const newPasswordError = validatePassword(passwordData.newPassword);
    if (newPasswordError) {
      setPasswordErrors((prev) => ({
        ...prev,
        new: newPasswordError,
      }));
      hasErrors = true;
    }

    // Confirm mật khẩu mới
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordErrors((prev) => ({
        ...prev,
        confirm: "Mật khẩu mới và xác nhận mật khẩu không khớp",
      }));
      hasErrors = true;
    }

    if (hasErrors) {
      setIsVerifying(false);
      return;
    }

    try {
      // getUser (lấy mk hiện tại)
      const currentUserResponse = await getUser();
      if (!currentUserResponse || !currentUserResponse.data) {
        toast.error("Không thể lấy thông tin người dùng. Vui lòng thử lại!");
        setIsVerifying(false);
        return;
      }

      const currentHashedPassword = currentUserResponse.data.password;

      // Xác thực mật khẩu hiện tại
      const isCurrentPasswordValid = await verifyCurrentPassword(
        passwordData.currentPassword,
        currentHashedPassword
      );

      if (!isCurrentPasswordValid) {
        setPasswordErrors((prev) => ({
          ...prev,
          current: "Mật khẩu hiện tại không chính xác, vui lòng thử lại",
        }));
        toast.error("Mật khẩu hiện tại không chính xác!");
        setIsVerifying(false);
        return;
      }

      // Tạo object chỉ chứa thông tin cần thiết để đổi mật khẩu
      const passwordUpdateData = {
        id: user.id,
        password: passwordData.newPassword, // Gửi mật khẩu mới (chưa hash)
      };

      await updateUserInfo(passwordUpdateData);
      console.log("Password updated successfully");

      // Reset form
      setEditPassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordErrors({
        current: "",
        new: "",
        confirm: "",
      });
      setPasswordValidationErrors({
        current: "",
        new: "",
        confirm: "",
      });

      toast.success("Đổi mật khẩu thành công!");
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Không thể đổi mật khẩu. Vui lòng thử lại!");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-white border-2 shadow-2xs">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-medium text-gray-700">ĐỔI MẬT KHẨU:</span>
        <button className="p-2 hover:bg-gray-100 rounded">
          <FontAwesomeIcon
            onClick={() => handleEditPasswordButton()}
            icon={faPenToSquare}
            className="text-lg text-gray-600"
          />
        </button>
      </div>

      <div className={editPassword ? "block" : "hidden"}>
        <div className="space-y-4">
          {/* CURRENT PASS */}
          <div className="flex items-center gap-6">
            <span className="text-sm font-medium text-gray-700 w-32">
              MẬT KHẨU HIỆN TẠI:
            </span>
            <div className="flex-1">
              <div className="relative">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) => {
                    const value = e.target.value;
                    setPasswordData({
                      ...passwordData,
                      currentPassword: value,
                    });
                    if (passwordErrors.current) {
                      setPasswordErrors((prev) => ({ ...prev, current: "" }));
                    }
                    const validationError = validatePasswordRealTime(value);
                    setPasswordValidationErrors((prev) => ({
                      ...prev,
                      current: validationError,
                    }));
                  }}
                  className={`w-full h-8 px-3 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    passwordErrors.current || passwordValidationErrors.current
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Nhập mật khẩu hiện tại"
                  disabled={isVerifying}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("current")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={isVerifying}
                >
                  <FontAwesomeIcon
                    icon={showPasswords.current ? faEyeSlash : faEye}
                    className="text-sm"
                  />
                </button>
              </div>
              {(passwordErrors.current || passwordValidationErrors.current) && (
                <div className="text-xs text-red-500 mt-1">
                  {passwordErrors.current || passwordValidationErrors.current}
                </div>
              )}
            </div>
          </div>

          {/* NEW PASS */}
          <div className="flex items-center gap-6">
            <span className="text-sm font-medium text-gray-700 w-32">
              MẬT KHẨU MỚI:
            </span>
            <div className="flex-1">
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => {
                    const value = e.target.value;
                    setPasswordData({
                      ...passwordData,
                      newPassword: value,
                    });
                    if (passwordErrors.new) {
                      setPasswordErrors((prev) => ({ ...prev, new: "" }));
                    }
                    const validationError = validatePasswordRealTime(value);
                    setPasswordValidationErrors((prev) => ({
                      ...prev,
                      new: validationError,
                    }));

                    if (
                      passwordData.confirmPassword &&
                      value !== passwordData.confirmPassword
                    ) {
                      setPasswordValidationErrors((prev) => ({
                        ...prev,
                        confirm: "Mật khẩu mới và xác nhận mật khẩu không khớp",
                      }));
                    } else if (
                      passwordData.confirmPassword &&
                      value === passwordData.confirmPassword
                    ) {
                      setPasswordValidationErrors((prev) => ({
                        ...prev,
                        confirm: "",
                      }));
                    }
                  }}
                  className={`w-full h-8 px-3 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    passwordErrors.new || passwordValidationErrors.new
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Nhập mật khẩu mới"
                  disabled={isVerifying}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={isVerifying}
                >
                  <FontAwesomeIcon
                    icon={showPasswords.new ? faEyeSlash : faEye}
                    className="text-sm"
                  />
                </button>
              </div>
              {(passwordErrors.new || passwordValidationErrors.new) && (
                <div className="text-xs text-red-500 mt-1">
                  {passwordErrors.new || passwordValidationErrors.new}
                </div>
              )}
            </div>
          </div>

          {/* CONFIRM PASS */}
          <div className="flex items-center gap-6">
            <span className="text-sm font-medium text-gray-700 w-32">
              NHẬP LẠI MẬT KHẨU:
            </span>
            <div className="flex-1">
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => {
                    const value = e.target.value;
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: value,
                    });
                    if (passwordErrors.confirm) {
                      setPasswordErrors((prev) => ({ ...prev, confirm: "" }));
                    }

                    if (
                      value &&
                      passwordData.newPassword &&
                      value !== passwordData.newPassword
                    ) {
                      setPasswordValidationErrors((prev) => ({
                        ...prev,
                        confirm: "Mật khẩu mới và xác nhận mật khẩu không khớp",
                      }));
                    } else {
                      setPasswordValidationErrors((prev) => ({
                        ...prev,
                        confirm: "",
                      }));
                    }
                  }}
                  className={`w-full h-8 px-3 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    passwordErrors.confirm || passwordValidationErrors.confirm
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Nhập lại mật khẩu mới"
                  disabled={isVerifying}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={isVerifying}
                >
                  <FontAwesomeIcon
                    icon={showPasswords.confirm ? faEyeSlash : faEye}
                    className="text-sm"
                  />
                </button>
              </div>
              {(passwordErrors.confirm || passwordValidationErrors.confirm) && (
                <div className="text-xs text-red-500 mt-1">
                  {passwordErrors.confirm || passwordValidationErrors.confirm}
                </div>
              )}
            </div>
          </div>

          {/* BTNS */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              className="p-2 hover:bg-gray-200 rounded"
              disabled={isVerifying}
            >
              <FontAwesomeIcon
                onClick={() => handleEditPasswordButton()}
                icon={faArrowLeftLong}
                className="text-lg text-gray-600"
              />
            </button>
            <button
              className={`p-2 hover:bg-gray-200 rounded ${
                isVerifying ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isVerifying}
            >
              <FontAwesomeIcon
                onClick={() => handleSavePasswordButton()}
                icon={faDownload}
                className="text-lg text-gray-600"
              />
            </button>
          </div>

          {isVerifying && (
            <div className="text-center text-sm text-blue-600 mt-2">
              Đang xác thực mật khẩu...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
