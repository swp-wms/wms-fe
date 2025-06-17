import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRotateLeft,
  faSave,
  faSquareXmark,
} from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";

const ProductEdit = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...product });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};

    // Mã hàng hóa bắt buộc bắt đầu bằng "TD"
    if (!/^TD/.test(formData.name || "")) {
      newErrors.name = "Mã hàng hóa phải bắt đầu bằng 'TD'";
    }

    // Tên hàng hóa phải theo định dạng: D10CB400V hoặc D12CB500T
    if (!/^Thép D\d{2}CB\d{3}[VT]$/.test(formData.namedetail || "")) {
      newErrors.namedetail =
        "Tên hàng hóa phải theo định dạng 'Thép DxxCBxxxV' hoặc 'Thép DxxCBxxxT', với x là chữ số";
    }

    // Mã thép phải theo định dạng: D + 2 số, ví dụ D10
    if (!/^D\d{2}$/.test(formData.steeltype || "")) {
      newErrors.steeltype =
        "Mã thép phải theo định dạng Dxx, với x là chữ số";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onSave(formData);
    }
  };

  const length = formData.catalog
    ? formData.catalog.length
    : formData.length || 0;
  const weight = formData.catalog
    ? formData.catalog.weightperbundle / formData.catalog.barsperbundle
    : formData.weight || 0;
  const totalWeight = formData.catalog
    ? formData.totalbar * weight
    : formData.total || 0;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg ms-[20%] shadow-xl border relative w-[60%]">
        <div className="space-y-3 text-sm grid grid-cols-3 gap-x-8">
          {/* Mã hàng hóa */}
          <div>
            <label className="block mb-1 font-medium">Mã hàng hóa:</label>
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              className={`w-full border px-2 py-1 rounded ${
                errors.name ? "border-red-500" : ""
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-[10px] mt-1">{errors.name}</p>
            )}
          </div>

          {/* Tên hàng hóa */}
          <div>
            <label className="block mb-1 font-medium">Tên hàng hóa:</label>
            <input
              type="text"
              name="namedetail"
              value={formData.namedetail || ""}
              onChange={handleChange}
              className={`w-full border px-2 py-1 rounded ${
                errors.namedetail ? "border-red-500" : ""
              }`}
            />
            {errors.namedetail && (
              <p className="text-red-500 text-[10px] mt-1">{errors.namedetail}</p>
            )}
          </div>

          {/* Tên nhà cung */}
          <div>
            <label className="block mb-1 font-medium">Tên nhà cung:</label>
            <input
              type="text"
              name="brandname"
              value={formData.brandname || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Loại thép:</label>
            <select
              name="type"
              value={formData.type || ""}
              onChange={handleChange}
              className={`w-full border px-1 py-1 rounded`}
            >
              <option value={formData.type}>{formData.type}</option>
              <option
                value={
                  formData.type === "Thép Thanh" ? "Thép Cuộn" : "Thép Thanh"
                }
              >
                {formData.type === "Thép Thanh" ? "Thép Cuộn" : "Thép Thanh"}
              </option>
            </select>
          </div>

          {/* Mã thép */}
          <div>
            <label className="block mb-1 font-medium">Mã thép:</label>
            <input
              type="text"
              name="steeltype"
              value={formData.steeltype || ""}
              onChange={handleChange}
              className={`w-full border px-2 py-1 rounded ${
                errors.steeltype ? "border-red-500" : ""
              }`}
            />
            {errors.steeltype && (
              <p className="text-red-500 text-[10px] mt-1">{errors.steeltype}</p>
            )}
          </div>

          {/* Số lượng */}
          <div>
            <label className="block mb-1 font-medium">Số lượng:</label>
            <input
              type="number"
              name="totalbar"
              value={formData.totalbar || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>

          {/* Độ dài */}
          <div>
            <label className="block mb-1 font-medium">Độ dài (m):</label>
            <input
              type="number"
              name="length"
              value={length || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>

          {/* Đơn trọng */}
          <div>
            <label className="block mb-1 font-medium">Đơn trọng (kg):</label>
            <input
              type="number"
              name="weight"
              value={weight.toFixed(2)}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>

          {/* Tổng khối lượng */}
          <div>
            <label className="block mb-1 font-medium">
              Tổng khối lượng (kg):
            </label>
            <input
              type="text"
              name="totalweight"
              value={totalWeight.toFixed(2)}
              readOnly
              className="w-full border px-2 py-1 rounded bg-gray-100"
            />
          </div>

          {/* Ghi chú */}
          <div>
            <label className="block mb-1 font-medium">Ghi chú:</label>
            <input
              type="text"
              name="note"
              value={formData.note || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
        </div>

        {/* Đóng popup */}
        <FontAwesomeIcon
          onClick={onClose}
          icon={faSquareXmark}
          className="absolute top-2 right-2 cursor-pointer text-red-700"
        />

        {/* Nút hành động */}
        <div className="flex justify-end mt-6 gap-3">
          <button
            onClick={onClose}
            className="px-4 py-1 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer font-medium"
          >
            <FontAwesomeIcon icon={faArrowRotateLeft} className="mr-2" />
            <span>Quay lại</span>
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 rounded bg-red-700 text-white hover:bg-red-800 cursor-pointer font-medium"
          >
            <FontAwesomeIcon icon={faSave} className="mr-2" />
            <span>Lưu</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductEdit;
