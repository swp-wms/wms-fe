import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faPenToSquare,
  faSave,
  faBackward,
} from "@fortawesome/free-solid-svg-icons";
import partner from "../../backendCalls/partner";
import toast from "react-hot-toast";

const PartnerDetailModal = ({
  isOpen,
  onClose,
  partner: partnerData,
  onUpdate,
  allPartners,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isOtherBank, setIsOtherBank] = useState(false);
  const [customBankName, setCustomBankName] = useState("");

  const bankOptions = [
    "Vietcombank",
    "Techcombank",
    "BIDV",
    "VietinBank",
    "VPBank",
    "MBBank",
    "ACB",
    "Agribank",
    "TPBank",
  ];

  const validateInput = (name, value) => {
    switch (name) {
      case "taxcode":
        return /^\d*$/.test(value) && value.length <= 13;
      case "phonenumber":
        return /^\d*$/.test(value) && value.length <= 11;
      case "bankaccount":
        return /^\d*$/.test(value) && value.length <= 15;
      case "email":
        return true;
      default:
        return true;
    }
  };

  const validateFinalInput = (name, value) => {
    switch (name) {
      case "taxcode":
        return /^\d{10,13}$/.test(value) || value === "";
      case "phonenumber":
        return /^\d{10,11}$/.test(value) || value === "";
      case "bankaccount":
        return /^\d{8,15}$/.test(value) || value === "";
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || value === "";
      default:
        return true;
    }
  };

  const getErrorMessage = (name) => {
    switch (name) {
      case "taxcode":
        return "Mã số thuế phải là dãy số từ 10-13 chữ số";
      case "phonenumber":
        return "Số điện thoại phải là dãy số từ 10-11 chữ số";
      case "bankaccount":
        return "Số tài khoản phải là dãy số từ 8-15 chữ số";
      case "email":
        return "Email không đúng định dạng";
      default:
        return "";
    }
  };

  const handleEditClick = () => {
    setEditFormData({ ...partnerData });
    setIsEditing(true);
    setError("");
    // setSuccess("");

    // Kiểm tra tên ngân hàng có trong danh sách k
    const isKnownBank = bankOptions.includes(partnerData.bankname);
    if (!isKnownBank && partnerData.bankname) {
      setIsOtherBank(true);
      setCustomBankName(partnerData.bankname);
    } else {
      setIsOtherBank(false);
      setCustomBankName("");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    // Don't allow changing ID
    if (name === "id") return;

    // Validate input
    if (!validateInput(name, newValue) && newValue !== "") {
      return;
    }

    setEditFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (error) setError("");
  };

  const handleBankChange = (e) => {
    const value = e.target.value;
    if (value === "other") {
      setIsOtherBank(true);
      setEditFormData((prev) => ({ ...prev, bankname: "" }));
    } else {
      setIsOtherBank(false);
      setCustomBankName("");
      setEditFormData((prev) => ({ ...prev, bankname: value }));
    }
  };

  const handleCustomBankChange = (e) => {
    const value = e.target.value;
    setCustomBankName(value);
    setEditFormData((prev) => ({ ...prev, bankname: value }));
  };

  const validateForm = () => {
    const errors = [];

    if (
      editFormData.taxcode &&
      !validateFinalInput("taxcode", editFormData.taxcode)
    ) {
      errors.push(getErrorMessage("taxcode"));
    }
    if (
      editFormData.phonenumber &&
      !validateFinalInput("phonenumber", editFormData.phonenumber)
    ) {
      errors.push(getErrorMessage("phonenumber"));
    }
    if (
      editFormData.bankaccount &&
      !validateFinalInput("bankaccount", editFormData.bankaccount)
    ) {
      errors.push(getErrorMessage("bankaccount"));
    }
    if (
      editFormData.email &&
      !validateFinalInput("email", editFormData.email)
    ) {
      errors.push(getErrorMessage("email"));
    }

    return errors;
  };

  const handleSave = async () => {
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(", "));
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await partner.updatePartner(editFormData);
      if (response.status === 200) {
        toast.success("Cập nhật đối tác thành công!");
        setIsEditing(false);
        onUpdate();
      }
    } catch (error) {
      console.error("Error updating partner:", error);
      if (error.response) {
        const errorMessage =
          error.response.data?.message || "Có lỗi xảy ra khi cập nhật đối tác";
        setError(errorMessage);
      } else {
        setError("Có lỗi xảy ra khi cập nhật đối tác");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditFormData({});
    setError("");
    // setSuccess("");
    setIsOtherBank(false);
    setCustomBankName("");
  };

  if (!isOpen || !partnerData) return null;

  const currentData = isEditing ? editFormData : partnerData;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-200 rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            {isEditing ? "Chỉnh sửa đối tác" : "Chi tiết đối tác"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        {/* Success Notification */}
        {/* {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">{success}</div>
        )} */}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Partner Details */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mã doanh nghiệp
              </label>
              <div className="p-3 bg-gray-50 rounded border">
                {currentData.id || "Chưa có thông tin"}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên doanh nghiệp{" "}
                {isEditing && <span className="text-red-500">*</span>}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={currentData.name || ""}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded border">
                  {currentData.name || "Chưa có thông tin"}
                </div>
              )}
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Địa chỉ
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={currentData.address || ""}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded border">
                  {currentData.address || "Chưa có thông tin"}
                </div>
              )}
            </div>

            {/* Tax Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mã số thuế{" "}
                {isEditing && (
                  <span className="text-xs text-gray-500">(10-13 số)</span>
                )}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="taxcode"
                  value={currentData.taxcode || ""}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="Nhập 10-13 chữ số"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded border">
                  {currentData.taxcode || "Chưa có thông tin"}
                </div>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại{" "}
                {isEditing && (
                  <span className="text-xs text-gray-500">(10-11 số)</span>
                )}
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phonenumber"
                  value={currentData.phonenumber || ""}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="Nhập 10-11 chữ số"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded border">
                  {currentData.phonenumber || "Chưa có thông tin"}
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={currentData.email || ""}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="example@email.com"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded border">
                  {currentData.email || "Chưa có thông tin"}
                </div>
              )}
            </div>

            {/* Bank Account */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số tài khoản{" "}
                {isEditing && (
                  <span className="text-xs text-gray-500">(8-15 số)</span>
                )}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="bankaccount"
                  value={currentData.bankaccount || ""}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="Nhập 8-15 chữ số"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded border">
                  {currentData.bankaccount || "Chưa có thông tin"}
                </div>
              )}
            </div>

            {/* Bank Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên ngân hàng
              </label>
              {isEditing ? (
                <div>
                  <select
                    value={isOtherBank ? "other" : currentData.bankname || ""}
                    onChange={handleBankChange}
                    disabled={loading}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Chọn ngân hàng</option>
                    {bankOptions.map((bank) => (
                      <option key={bank} value={bank}>
                        {bank}
                      </option>
                    ))}
                    <option value="other">Khác</option>
                  </select>
                  {isOtherBank && (
                    <input
                      type="text"
                      value={customBankName}
                      onChange={handleCustomBankChange}
                      disabled={loading}
                      placeholder="Nhập tên ngân hàng"
                      className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                    />
                  )}
                </div>
              ) : (
                <div className="p-3 bg-gray-50 rounded border">
                  {currentData.bankname || "Chưa có thông tin"}
                </div>
              )}
            </div>

            {/* Factory Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại đối tác
              </label>
              {isEditing ? (
                <div className="flex items-center p-3 border border-gray-300 rounded">
                  <input
                    type="checkbox"
                    name="isfactory"
                    checked={currentData.isfactory || false}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Là nhà máy</span>
                </div>
              ) : (
                <div className="p-3 bg-gray-50 rounded border">
                  {currentData.isfactory ? "Nhà máy" : "Không phải nhà máy"}
                </div>
              )}
            </div>

            {/* Note */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ghi chú
              </label>
              {isEditing ? (
                <textarea
                  name="note"
                  value={currentData.note || ""}
                  onChange={handleInputChange}
                  disabled={loading}
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded border min-h-[80px]">
                  {currentData.note || "Chưa có ghi chú"}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                disabled={loading}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FontAwesomeIcon icon={faBackward} />
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FontAwesomeIcon icon={faSave} />
                {loading ? "Đang lưu..." : "Lưu"}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Đóng
              </button>
              <button
                onClick={handleEditClick}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faPenToSquare} />
                Chỉnh sửa
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartnerDetailModal;
