import { faArrowLeftLong, faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import toast from "react-hot-toast";
import ImageUpload from "./ImageUpload";

const EditProfile = ({
  user,
  setUser,
  updateUserInfo,
  onCancel,
  onImageUpload,
}) => {
  const [errors, setErrors] = useState({
    fullname: "",
    gender: "",
    dateofbirth: "",
    phonenumber: "",
    username: "",
    address: "",
  });

  // Safe validation functions with null/undefined checks
  const validateFullName = (name) => {
    const safeName = name?.toString() || "";
    if (!safeName.trim()) return "Tên nhân viên không được để trống";
    if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(safeName)) {
      return "Tên nhân viên chỉ được chứa chữ cái và khoảng trắng";
    }
    return "";
  };

  const validatePhoneNumber = (phone) => {
    const safePhone = phone?.toString() || "";
    if (!safePhone.trim()) return "Số điện thoại không được để trống";
    const phoneRegex = /^0\d{9,10}$/;
    if (!phoneRegex.test(safePhone)) {
      return "Số điện thoại không đúng định dạng";
    }
    return "";
  };

  const validateEmail = (email) => {
    const safeEmail = email?.toString() || "";
    if (!safeEmail.trim()) return "Email không được để trống";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(safeEmail)) {
      return "Email không đúng định dạng";
    }
    return "";
  };

  const validateDateOfBirth = (date) => {
    if (!date) return "Ngày sinh không được để trống";
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (birthDate > today) {
      return "Ngày sinh không thể là ngày trong tương lai";
    }
    if (age < 18 || age > 65) {
      return "Tuổi phải từ 18 đến 65";
    }
    return "";
  };

  const handleInputChange = (field, value) => {
    setUser({ ...user, [field]: value });
    // Xoá thông báo lỗi khi người dùng nhập thông tin
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    // VALIDATIONS
    let error = "";
    switch (field) {
      case "fullname":
        error = validateFullName(value);
        break;
      case "phonenumber":
        error = validatePhoneNumber(value);
        break;
      case "username":
        error = validateEmail(value);
        break;
      case "dateofbirth":
        error = validateDateOfBirth(value);
        break;
      default:
        break;
    }
    if (error) {
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleSaveInfoButton = async () => {
    // VALIDATE with safe checks
    const newErrors = {
      fullname: validateFullName(user.fullname),
      gender: !user.gender ? "Vui lòng chọn giới tính" : "",
      dateofbirth: validateDateOfBirth(user.dateofbirth),
      phonenumber: validatePhoneNumber(user.phonenumber),
      username: validateEmail(user.username),
      address: !(user.address?.toString() || "").trim()
        ? "Địa chỉ không được để trống"
        : "",
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error !== "");
    if (hasErrors) {
      toast.error("Vui lòng sửa các lỗi trước khi lưu");
      return;
    }

    try {
      // Tạo object mới không có password
      const userDataToUpdate = {
        id: user.id,
        username: user.username,
        roleid: user.roleid,
        fullname: user.fullname,
        image: user.image,
        phonenumber: user.phonenumber,
        address: user.address,
        dateofbirth: user.dateofbirth,
        gender: user.gender,
        status: user.status,
      };

      ////// DEBUG
      console.log("Data being sent for profile update:", userDataToUpdate);
      console.log("Password field exists:", "password" in userDataToUpdate);

      await updateUserInfo(userDataToUpdate);
      console.log("User info updated successfully");
      onCancel();
      toast.success("Cập nhật thông tin thành công!");
    } catch (error) {
      console.error("Error updating user info:", error);
      toast.error("Không thể cập nhật thông tin. Vui lòng thử lại!");
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg p-6 w-124 bg-white border-2 shadow-2xs">
      <div className="flex flex-row justify-between">
        <div className="justify-start">
          <button className="p-2 hover:bg-gray-100 rounded">
            <FontAwesomeIcon
              onClick={onCancel}
              icon={faArrowLeftLong}
              className="text-lg text-gray-600"
            />
          </button>
        </div>
        <div className="justify-end">
          <button className="p-2 hover:bg-gray-100 rounded">
            <FontAwesomeIcon
              onClick={handleSaveInfoButton}
              icon={faDownload}
              className="text-lg text-gray-600"
            />
          </button>
        </div>
      </div>

      <div className="flex justify-center mb-6">
        <ImageUpload
          currentImage={user.image}
          onImageUpload={onImageUpload}
          isEditing={true}
        />
      </div>

      <div className="flex justify-center mb-8">
        <span className="text-white font-bold px-6 py-2 bg-red-700 rounded-full text-sm">
          {user.roleid === 1
            ? "System Admin"
            : user.roleid === 3
            ? "Salesman"
            : user.roleid === 4
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
            value={user.id || ""}
            readOnly
            className="flex-1 ml-2 h-8 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700 w-32">
            Tên nhân viên:
          </span>
          <div className="flex-1 ml-2">
            <input
              value={user.fullname || ""}
              onChange={(e) => handleInputChange("fullname", e.target.value)}
              className={`w-full h-8 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.fullname ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.fullname && (
              <div className="text-xs text-red-500 mt-1">{errors.fullname}</div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700 w-32">
            Giới tính:
          </span>
          <div className="flex-1 ml-2">
            <select
              value={user.gender || ""}
              onChange={(e) => handleInputChange("gender", e.target.value)}
              className={`w-full h-8 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.gender ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Chọn giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
            {errors.gender && (
              <div className="text-xs text-red-500 mt-1">{errors.gender}</div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700 w-32">
            Ngày sinh:
          </span>
          <div className="flex-1 ml-2">
            <input
              type="date"
              value={user.dateofbirth || ""}
              onChange={(e) => handleInputChange("dateofbirth", e.target.value)}
              className={`w-full h-8 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.dateofbirth ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.dateofbirth && (
              <div className="text-xs text-red-500 mt-1">
                {errors.dateofbirth}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700 w-32">
            Số điện thoại:
          </span>
          <div className="flex-1 ml-2">
            <input
              type="tel"
              value={user.phonenumber || ""}
              onChange={(e) => handleInputChange("phonenumber", e.target.value)}
              className={`w-full h-8 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.phonenumber ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="VD: 0901234567"
            />
            {errors.phonenumber && (
              <div className="text-xs text-red-500 mt-1">
                {errors.phonenumber}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700 w-32">Email:</span>
          <div className="flex-1 ml-2">
            <input
              type="email"
              value={user.username || ""}
              onChange={(e) => handleInputChange("username", e.target.value)}
              className={`w-full h-8 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.username ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="example@email.com"
            />
            {errors.username && (
              <div className="text-xs text-red-500 mt-1">{errors.username}</div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700 w-32">
            Địa chỉ:
          </span>
          <div className="flex-1 ml-2">
            <input
              value={user.address || ""}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className={`w-full h-8 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.address ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập địa chỉ"
            />
            {errors.address && (
              <div className="text-xs text-red-500 mt-1">{errors.address}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
