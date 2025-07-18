import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRotateLeft,
  faSave,
  faSquareXmark,
} from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { fetchPartners } from "../../backendCalls/partner";
import {
  addProduct,
  updateProductCatalog,
} from "../../backendCalls/productCatalog";

const ProductEdit = ({ product, onClose, onUpdate, catalog }) => {
  const [formData, setFormData] = useState({ ...product });
  const [errors, setErrors] = useState({});
  const [partners, setPartners] = useState([]);
  const [validBrands, setValidBrands] = useState([]);

  useEffect(() => {
    if (!formData.steeltype || !formData.type) return;

    const filteredBrands = catalog
      .filter(
        (item) =>
          item.steeltype === formData.steeltype && item.type === formData.type
      )
      .map((item) => item.brandname);

    const uniqueBrands = [...new Set(filteredBrands)];
    setValidBrands(uniqueBrands);
  }, [formData.steeltype, formData.type, catalog]);

  const notify = () => toast.error("Vui lòng nhập lại thông tin");

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(value);
    

    if (name === "pd") {
      const pdValue = value;
      let namedetail = "";
      let steeltype = "";

      const match = /^T(D\d{2}CB\d{3}[VT])$/.exec(pdValue);
      if (match) {
        namedetail = "Thép " + match[1];
        steeltype = match[1].match(/D\d{2}/)?.[0] || "";
      }

      setFormData((prev) => ({
        ...prev,
        [name]: pdValue,
        namedetail,
        steeltype,
      }));
    } else if (name === "type") {
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else if (name === "partner") {
      const selectedPartner = partners.find(
        (p) =>
          p.name === value
      );
      console.log(selectedPartner);
      if (selectedPartner) {
        setFormData((prev) => ({ ...prev, [name]: selectedPartner.id }));
      } else {
        toast.error("Loại thép không khả dụng cho hãng hoặc mã thép đã chọn");
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!/^TD/.test(formData.pd || ""))
      newErrors.pd = "Mã hàng hóa phải bắt đầu bằng 'TD'";

    setErrors(newErrors);
    if (Object.keys(newErrors).length) notify();
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    const loading = toast.loading("Đang lưu thông tin");

    if (!validate()) {
      toast.dismiss(loading);
      return;
    }

    try {
      let savedProduct;

      if (formData.productid) {
        await updateProductCatalog(formData.productid, formData);
        savedProduct = formData;
      } else {
        savedProduct = await addProduct(formData);
      }

      toast.success("Lưu thành công");
      onUpdate?.(savedProduct);
      onClose();
    } catch (error) {
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

  const length = formData.length || formData?.length || 0;
  const weight =
    formData.weight || formData?.weightperbundle / formData?.barsperbundle || 0;
  // const totalWeight = (formData.totalbar || 0) * weight;

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
            { label: "Mã hàng hóa", name: "pd", error: errors.pd },
            {
              label: "Tên hàng hóa",
              name: "namedetail",
              readOnly: true,
            },
            {
              label: "Mã thép",
              name: "steeltype",
              readOnly: true,
            },
            { label: "Số lượng", name: "totalbar", type: "number" },
            {
              label: "Độ dài (m)",
              name: "length",
              type: "number",
              value: length,
              readOnly: true,
            },
            {
              label: "Đơn trọng (kg)",
              name: "weight",
              type: "number",
              value: weight.toFixed(2),
              readOnly: true,
            },
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
                  onChange={(e) => handleChange(e)}
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
            <label className="block mb-1 font-medium">Tên hãng thép:</label>
            <select
              name="brandname"
              value={formData.brandname || ""}
              onChange={(e) => handleChange(e)}
              className="w-full border px-2 py-1 rounded"
            >
              <option value="" disabled>
                Vui lòng chọn hãng thép
              </option>
              {validBrands.map((brand, index) => (
                <option key={index} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Loại thép:</label>
            <select
              name="type"
              value={formData.type}
              onChange={(e) => handleChange(e)}
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
              onChange={(e) => handleChange(e)}
              type="number"
              name="totalweight"
              value={formData.totalweight}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-8 text-sm">
          <div>
            <label className="block mb-1 font-medium">Tên nhà cung:</label>
            <select
              name="partner"
              onChange={(e) => handleChange(e)}
              className="w-full border px-2 py-1 rounded"
            >
              {product.name !== null ? (
                <option value="" className="truncate">
                  {product.name}
                </option>
              ) : (
                <option value="" disabled selected className="truncate">
                  Vui lòng chọn đối tác
                </option>
              )}

              {partners.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Ghi chú:</label>
            <input
              onChange={(e) => handleChange(e)}
              type="text"
              name="note"
              className="w-full border px-2 py-1 rounded"
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
