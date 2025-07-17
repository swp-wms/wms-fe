import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPenToSquare } from "@fortawesome/free-solid-svg-icons";

const PartnerDetailModal = ({
  isOpen,
  onClose,
  partner,
  onUpdate,
  allPartners,
}) => {

  if (!isOpen || !partner) return null;

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  return (
    <>
      <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-300 rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Chi tiết đối tác</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
          </div>

          {/* Partner Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mã doanh nghiệp
                </label>
                <div className="p-3 bg-gray-50 rounded border">
                  {partner.id || "Chưa có thông tin"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên doanh nghiệp
                </label>
                <div className="p-3 bg-gray-50 rounded border">
                  {partner.name || "Chưa có thông tin"}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ
                </label>
                <div className="p-3 bg-gray-50 rounded border">
                  {partner.address || "Chưa có thông tin"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mã số thuế
                </label>
                <div className="p-3 bg-gray-50 rounded border">
                  {partner.taxcode || "Chưa có thông tin"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <div className="p-3 bg-gray-50 rounded border">
                  {partner.phonenumber || "Chưa có thông tin"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="p-3 bg-gray-50 rounded border">
                  {partner.email || "Chưa có thông tin"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số tài khoản
                </label>
                <div className="p-3 bg-gray-50 rounded border">
                  {partner.bankaccount || "Chưa có thông tin"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên ngân hàng
                </label>
                <div className="p-3 bg-gray-50 rounded border">
                  {partner.bankname || "Chưa có thông tin"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại đối tác
                </label>
                <div className="p-3 bg-gray-50 rounded border">
                  {partner.isfactory ? "Nhà máy" : "Không phải nhà máy"}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú
                </label>
                <div className="p-3 bg-gray-50 rounded border min-h-[80px]">
                  {partner.note || "Chưa có ghi chú"}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Đóng
            </button>
            <button
            //   onClick
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faPenToSquare} />
              Chỉnh sửa
            </button>
          </div>
        </div>
      </div>

    </>
  );
};

export default PartnerDetailModal;
