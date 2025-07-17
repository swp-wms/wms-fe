import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRotateLeft,
  faSave,
  faSquareXmark,
} from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { updateProduct } from "../../backendCalls/product";
import { fetchPartners } from "../../backendCalls/partner";

const ProductEdit = ({ product, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({ ...product });
  const [errors, setErrors] = useState({});
  const [partners, setPartners] = useState([]);

  const notify = () => toast.error("Vui lòng nhập lại thông tin");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!/^TD/.test(formData.name || ""))
      newErrors.name = "Mã hàng hóa phải bắt đầu bằng 'TD'";
    if (!/^Thép D\d{2}CB\d{3}[VT]$/.test(formData.namedetail || ""))
      newErrors.namedetail = "Tên hàng hóa không đúng định dạng";
    if (!/^D\d{2}$/.test(formData.steeltype || ""))
      newErrors.steeltype = "Mã thép phải theo định dạng Dxx";

    setErrors(newErrors);
    if (Object.keys(newErrors).length) notify();
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    const loading = toast.loading("Đang lưu...");
    if (!validate()) return toast.dismiss(loading);

    try {
      await updateProduct(formData.id, formData);
      toast.success("Lưu thành công");
      onUpdate?.(formData);
      onClose();
    } catch {
      toast.error("Lưu thất bại");
    } finally {
      toast.dismiss(loading);
    }
  };

  useEffect(() => {
    const getData = async () => {
      const response = await fetchPartners();
      setPartners(response);
      console.log(response);
    };
    getData();
  }, []);

  const length = formData.length || formData.catalog?.length || 0;
  const weight =
    formData.weight ||
    formData.catalog?.weightperbundle / formData.catalog?.barsperbundle ||
    0;
  const totalWeight = (formData.totalbar || 0) * weight;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg ms-[20%] shadow-xl border relative w-[60%]">
        <FontAwesomeIcon
          onClick={onClose}
          icon={faSquareXmark}
          className="absolute top-2 right-2 cursor-pointer text-red-700"
        />

        <div className="space-y-3 text-sm grid grid-cols-3 gap-x-8">
          {[
            { label: "Mã hàng hóa", name: "name", error: errors.name },
            {
              label: "Tên hàng hóa",
              name: "namedetail",
              error: errors.namedetail,
            },
            { label: "Tên nhà cung", name: "brandname" },
            { label: "Mã thép", name: "steeltype", error: errors.steeltype },
            { label: "Số lượng", name: "totalbar", type: "number" },
            {
              label: "Độ dài (m)",
              name: "length",
              type: "number",
              value: length,
            },
            {
              label: "Đơn trọng (kg)",
              name: "weight",
              type: "number",
              value: weight.toFixed(2),
            },
            { label: "Ghi chú", name: "note" },
          ].map(
            ({
              label,
              name,
              type = "text",
              readOnly = false,
              error,
              value,
            }) => (
              <div key={name}>
                <label className="block mb-1 font-medium">{label}:</label>
                <input
                  type={type}
                  name={name}
                  value={value ?? formData[name] ?? ""}
                  onChange={handleChange}
                  readOnly={readOnly}
                  className={`w-full border px-2 py-1 rounded ${
                    readOnly ? "bg-gray-100 cursor-not-allowed" : ""
                  } ${error ? "border-red-500" : ""}`}
                />
                {error && (
                  <p className="text-red-500 text-[10px] mt-1">{error}</p>
                )}
              </div>
            )
          )}

          <div>
            <label className="block mb-1 font-medium">Tên đối tác:</label>
            <select
              name="partner"
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            >
              {product.partner === null ? (
                <option value="" className="truncate">
                  {product.partner.name}
                </option>
              ) : (
                <option value="" disabled selected className="truncate">
                  Vui lòng chọn đối tác
                </option>
              )}

              {partners.map((partner) => (
                <option key={partner.id} value={partner.name}>
                  {partner.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Loại thép:</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border px-1 py-1 rounded"
            >
              <option value="Thép Thanh">Thép Thanh</option>
              <option value="Thép Cuộn">Thép Cuộn</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Tổng khối lượng (kg):
            </label>
            <input
              type="text"
              name="totalweight"
              value={totalWeight.toFixed(2)}
              readOnly
              className="w-full border px-2 py-1 rounded bg-gray-100 cursor-not-allowed"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6 gap-3">
          <button
            onClick={onClose}
            className="px-4 py-1 bg-gray-200 rounded hover:bg-gray-300 font-medium"
          >
            <FontAwesomeIcon icon={faArrowRotateLeft} className="mr-2" />
            Quay lại
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 rounded bg-red-700 text-white hover:bg-red-800 font-medium"
          >
            <FontAwesomeIcon icon={faSave} className="mr-2" />
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductEdit;
