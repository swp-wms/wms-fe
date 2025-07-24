import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faBackward } from "@fortawesome/free-solid-svg-icons";
import partner from "../../backendCalls/partner";
import toast from "react-hot-toast";

const AddPartnerModal = ({ isOpen, onClose, onSuccess, allPartners }) => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    address: "",
    taxcode: "",
    phonenumber: "",
    email: "",
    bankaccount: "",
    bankname: "",
    note: "",
    isfactory: false,
  });
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

  // Generate next partner ID
  const generateNextPartnerId = () => {
    if (!allPartners || allPartners.length === 0) {
      return "KH001";
    }

    // Find the highest ID number
    let maxNumber = 0;
    allPartners.forEach((p) => {
      if (p.id && p.id.startsWith("KH")) {
        const numberPart = Number.parseInt(p.id.substring(2));
        if (!isNaN(numberPart) && numberPart > maxNumber) {
          maxNumber = numberPart;
        }
      }
    });

    // Generate next ID
    const nextNumber = maxNumber + 1;
    return `KH${nextNumber.toString().padStart(3, "0")}`;
  };

  useEffect(() => {
    if (isOpen && allPartners) {
      const nextId = generateNextPartnerId();
      setFormData((prev) => ({
        ...prev,
        id: nextId,
      }));
    }
  }, [isOpen, allPartners]);

  const resetForm = () => {
    const nextId = generateNextPartnerId();
    setFormData({
      id: nextId,
      name: "",
      address: "",
      taxcode: "",
      phonenumber: "",
      email: "",
      bankaccount: "",
      bankname: "",
      note: "",
      isfactory: false,
    });
    setError("");
    setIsOtherBank(false);
    setCustomBankName("");
  };

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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    // Ko đổi ID
    if (name === "id") return;

    // Validate
    if (!validateInput(name, newValue) && newValue !== "") {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (error) setError("");
  };

  const handleBankChange = (e) => {
    const value = e.target.value;
    if (value === "other") {
      setIsOtherBank(true);
      setFormData((prev) => ({ ...prev, bankname: "" }));
    } else {
      setIsOtherBank(false);
      setCustomBankName("");
      setFormData((prev) => ({ ...prev, bankname: value }));
    }
  };

  const handleCustomBankChange = (e) => {
    const value = e.target.value;
    setCustomBankName(value);
    setFormData((prev) => ({ ...prev, bankname: value }));
  };

  const validateForm = () => {
    const errors = [];

    if (formData.taxcode && !validateFinalInput("taxcode", formData.taxcode)) {
      errors.push(getErrorMessage("taxcode"));
    }
    if (
      formData.phonenumber &&
      !validateFinalInput("phonenumber", formData.phonenumber)
    ) {
      errors.push(getErrorMessage("phonenumber"));
    }
    if (
      formData.bankaccount &&
      !validateFinalInput("bankaccount", formData.bankaccount)
    ) {
      errors.push(getErrorMessage("bankaccount"));
    }
    if (formData.email && !validateFinalInput("email", formData.email)) {
      errors.push(getErrorMessage("email"));
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(", "));
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await partner.addPartner(formData);
      if (response.status === 200 || response.status === 201) {
        toast.success("Thêm đối tác thành công!");
        resetForm();
        onClose();
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error("Error adding partner:", error);
      if (error.response) {
        const errorMessage =
          error.response.data?.message || "Có lỗi xảy ra khi thêm đối tác";
        setError(errorMessage);
      } else if (error.request) {
        setError("Không thể kết nối đến server. Vui lòng thử lại.");
      } else {
        setError("Có lỗi không xác định xảy ra. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    resetForm();
    onClose();
  };

  const handleClose = () => {
    if (!loading) {
      resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-200 rounded-lg p-6 w-full max-w-2xl mx-4 shadow-lg">
        {/* Close BTN */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-red-500 hover:text-red-700 text-xl font-bold w-8 h-8 flex items-center justify-center border border-red-500 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ×
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* ID + NAME */}
          <div className="grid grid-cols-1 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                MÃ DOANH NGHIỆP
              </label>
              <input
                type="text"
                name="id"
                value={formData.id}
                disabled={true}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                TÊN DOANH NGHIỆP <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              />
            </div>
          </div>

          {/* ADDRESS + TAX CODE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Địa chỉ:
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã số thuế:{" "}
                <span className="text-xs text-gray-500">(10-13 số)</span>
              </label>
              <input
                type="text"
                name="taxcode"
                value={formData.taxcode}
                onChange={handleInputChange}
                disabled={loading}
                placeholder="Nhập 10-13 chữ số"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* PHONE + BANK ACCOUNT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại:{" "}
                <span className="text-xs text-gray-500">(10-11 số)</span>
              </label>
              <input
                type="tel"
                name="phonenumber"
                value={formData.phonenumber}
                onChange={handleInputChange}
                disabled={loading}
                placeholder="Nhập 10-11 chữ số"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số tài khoản:{" "}
                <span className="text-xs text-gray-500">(8-15 số)</span>
              </label>
              <input
                type="text"
                name="bankaccount"
                value={formData.bankaccount}
                onChange={handleInputChange}
                disabled={loading}
                placeholder="Nhập 8-15 chữ số"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* EMAIL + BANK NAME */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email:
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={loading}
                placeholder="example@email.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên ngân hàng:
              </label>
              <select
                value={isOtherBank ? "other" : formData.bankname}
                onChange={handleBankChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed mt-2"
                />
              )}
            </div>
          </div>

          {/* NOTE + isFactory */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ghi chú:
              </label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleInputChange}
                disabled={loading}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại đối tác:
              </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isfactory"
                  checked={formData.isfactory}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:cursor-not-allowed"
                />
                <span className="text-sm text-gray-700">Là nhà máy</span>
              </div>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleBack}
              disabled={loading}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FontAwesomeIcon icon={faBackward} />
              Quay lại
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FontAwesomeIcon icon={faSave} />
              {loading ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPartnerModal;
