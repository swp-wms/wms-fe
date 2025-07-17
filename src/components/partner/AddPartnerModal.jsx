import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faBackward } from "@fortawesome/free-solid-svg-icons";
import partner from "../../backendCalls/partner";

const AddPartnerModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    id:"",
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

  // const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const resetForm = () => {
    setFormData({
      id:"",
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
    setSuccess("");
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await partner.addPartner(formData);

      if (response.status === 200 || response.status === 201) {
        setSuccess("Thêm đối tác thành công!");

        setTimeout(() => {
          resetForm();
          onClose();

          if (onSuccess) {
            onSuccess();
          }
        }, 1500);
      }
    } catch (error) {
      console.error("Error adding partner:", error);

      if (error.response) {
        // Server responded with error status
        const errorMessage =
          error.response.data?.message || "Có lỗi xảy ra khi thêm đối tác";
        setError(errorMessage);
      } else if (error.request) {
        // Request was made but no response received
        setError("Không thể kết nối đến server. Vui lòng thử lại.");
      } else {
        // Something else happened
        setError("Có lỗi không xác định xảy ra. Vui lòng thử lại.");
      }
    } 
    // finally {
    //   setLoading(false);
    // }
  };

  const handleBack = () => {
    resetForm();
    onClose();
  };

  const handleClose = () => {
    // if (!loading) {
      resetForm();
      onClose();
    // }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-200 rounded-lg p-6 w-full max-w-2xl mx-4 shadow-lg">
        {/* Header with close button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleClose}
            // disabled={loading}
            className="text-red-500 hover:text-red-700 text-xl font-bold w-8 h-8 flex items-center justify-center border border-red-500 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ×
          </button>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

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
                MÃ DOANH NGHIỆP <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleInputChange}
                // disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                // disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              />
            </div>
          </div>

          {/* ADDRESS + TAX NUMB */}
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
                // disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã số thuế:
              </label>
              <input
                type="text"
                name="taxcode"
                value={formData.taxcode}
                onChange={handleInputChange}
                // disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* PHONE + BANK ACC */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại:
              </label>
              <input
                type="tel"
                name="phonenumber"
                value={formData.phonenumber}
                onChange={handleInputChange}
                // disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số tài khoản:
              </label>
              <input
                type="text"
                name="bankaccount"
                value={formData.bankaccount}
                onChange={handleInputChange}
                // disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* MAIL + BANK NAME */}
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
                // disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên ngân hàng:
              </label>
              <input
                type="text"
                name="bankname"
                value={formData.bankname}
                onChange={handleInputChange}
                // disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
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
                // disabled={loading}
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
                  // disabled={loading}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:cursor-not-allowed"
                />
                <span className="text-sm text-gray-700">Là nhà máy</span>
              </div>
            </div>
          </div>

          {/* BTNS */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleBack}
              // disabled={loading}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FontAwesomeIcon icon={faBackward} />
              Quay lại
            </button>
            <button
              type="submit"
              // disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FontAwesomeIcon icon={faSave} />
              {/* {loading ? "Đang lưu..." : "Lưu"} */}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPartnerModal;
