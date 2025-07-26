import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faPenToSquare,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { getAllUserInfo, updateUserInfo } from "../../backendCalls/userInfo";
import toast from "react-hot-toast";
import EditUserModal from "./EditUserModal";
import CreateUserModal from "./CreateUserModal";
import { getUser } from "../../backendCalls/user";

const AccountManage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [users, setUsers] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRoleConflictModal, setShowRoleConflictModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [conflictingUser, setConflictingUser] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getData = async () => {
    try {
      // Thông tin all user
      const response = await getAllUserInfo();
      if (response.status !== 200) {
        window.location.href = "/dang-nhap";
        return;
      }
      const userData = response.data;
      console.log("API Response:", userData);
      setUsers(Array.isArray(userData) ? userData : []);
      // Thông tin bản thân
      const currentUserResponse = await getUser();
      if (currentUserResponse.status === 200) {
        setCurrentUser(currentUserResponse.data);
        console.log("Current User:", currentUserResponse.data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUsers([]);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Reset trang khi filter/ search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedPosition, selectedStatus]);

  // Lấy tên để sort
  const getLastWord = (fullname) => {
    if (!fullname) return "";
    const words = fullname.trim().split(/\s+/);
    return words[words.length - 1].toLowerCase();
  };

  // Lấy vị trí để sort
  const findActiveUserByRole = (roleName) => {
    return users.find(
      (user) => user?.role?.rolename === roleName && user?.status === "1"
    );
  };

  const isCurrentUser = (user) => {
    if (!currentUser || !user) return false;
    return currentUser.username === user.username;
  };

  const filteredUsers = users
    .filter((user) => {
      const matchesSearch =
        user?.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user?.username?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPosition =
        selectedPosition === "" || user?.role?.rolename === selectedPosition;
      const matchesStatus =
        selectedStatus === "" ||
        (selectedStatus === "active" && user?.status === "1") ||
        (selectedStatus === "inactive" && user?.status === "0");
      return matchesSearch && matchesPosition && matchesStatus;
    })
    .sort((a, b) => {
      // Sort trạng thái
      if (a?.status !== b?.status) {
        return b?.status?.localeCompare(a?.status || "");
      }
      // Sort tên
      const lastWordA = getLastWord(a?.fullname);
      const lastWordB = getLastWord(b?.fullname);
      return lastWordA.localeCompare(lastWordB);
    });

  // PAGING STUFFS
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const positions = [
    "Salesman",
    "Warehouse keeper",
    "Delivery staff",
    "System admin",
  ];
  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  const handleStatusClick = (user) => {
    // Thay đổi trạng thái WH keeper / Delivery Staff
    if (
      user.status === "0" && // chỉ khi active
      (user?.role?.rolename === "Warehouse keeper" ||
        user?.role?.rolename === "Delivery staff")
    ) {
      const activeUser = findActiveUserByRole(user?.role?.rolename);
      if (activeUser && activeUser.id !== user.id) {
        setSelectedUser(user);
        setConflictingUser(activeUser);
        setShowRoleConflictModal(true);
        return;
      }
    }
    setSelectedUser(user);
    setShowConfirmModal(true);
  };

  const handleConfirmStatusChange = async () => {
    if (!selectedUser) return;
    console.log("Selected User:", selectedUser);
    setIsUpdating(true);
    try {
      const newStatus = selectedUser.status === "1" ? "0" : "1";
      const updatedUserData = {
        ...selectedUser,
        status: newStatus,
      };
      const response = await updateUserInfo(updatedUserData);
      if (response.status === 200) {
        toast.success("Cập nhật trạng thái thành công!");
        getData(); // Refresh
      } else {
        toast.error("Có lỗi xảy ra khi cập nhật trạng thái!");
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái!");
    } finally {
      setIsUpdating(false);
      setShowConfirmModal(false);
      setSelectedUser(null);
    }
  };

  const handleRoleConflictConfirm = async (deactivateOther) => {
    if (!selectedUser) return;
    setIsUpdating(true);
    try {
      if (deactivateOther && conflictingUser) {
        // Deactive user conflict
        const deactivateResponse = await updateUserInfo({
          ...conflictingUser,
          status: "0",
        });
        if (deactivateResponse.status !== 200) {
          toast.error("Có lỗi xảy ra khi cập nhật trạng thái!");
          return;
        }
      }
      // Active người dùng đc chọn
      const activateResponse = await updateUserInfo({
        ...selectedUser,
        status: "1",
      });
      if (activateResponse.status === 200) {
        toast.success("Cập nhật trạng thái thành công!");
        getData(); // Refresh
      } else {
        toast.error("Có lỗi xảy ra khi cập nhật trạng thái!");
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái!");
    } finally {
      setIsUpdating(false);
      setShowRoleConflictModal(false);
      setSelectedUser(null);
      setConflictingUser(null);
    }
  };

  const handleCancelStatusChange = () => {
    setShowConfirmModal(false);
    setSelectedUser(null);
  };

  const handleCancelRoleConflict = () => {
    setShowRoleConflictModal(false);
    setSelectedUser(null);
    setConflictingUser(null);
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  const handleEditSuccess = () => {
    getData();
    setShowEditModal(false);
    setEditingUser(null);
  };

  const handleCreateClick = () => {
    setShowCreateModal(true);
  };

  const handleCreateSuccess = async () => {
    getData();
    setShowCreateModal(false);
  };

  // PAGING HANDLER
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // TỔNG TRANG
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen mt-20 ml-75">
      {/* SEARCH + FILTER + ADD */}
      <div className="flex items-center justify-between mb-6 gap-4">
        {/* SEARCH */}
        <div className="flex-1 max-w-md relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="text-gray-400"
            />
          </div>
          <input
            autoComplete="off"
            type="text"
            placeholder="Tìm kiếm tên nhân viên, tên đăng nhập"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        {/* FILTER */}
        <div className="flex gap-3">
          {/* FILTER VỊ TRÍ */}
          <div className="flex-shrink-0">
            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="">Tất cả vị trí</option>
              {positions.map((position) => (
                <option key={position} value={position}>
                  {position}
                </option>
              ))}
            </select>
          </div>
          {/* FILTER TRẠNG THÁI */}
          <div className="flex-shrink-0">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="">Tất cả trạng thái</option>
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* ADD */}
        <button
          onClick={handleCreateClick}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <span className="text-lg">+</span>
          <span>Thêm tài khoản</span>
        </button>
      </div>
      {/* Results Info */}
      <div className="mb-4 text-sm text-gray-600">
        Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} của{" "}
        {filteredUsers.length} kết quả
      </div>
      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ẢNH ĐẠI DIỆN
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                TÊN NHÂN VIÊN
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                VỊ TRÍ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                TÊN ĐĂNG NHẬP
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                TRẠNG THÁI
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                TÙY CHỌN
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  Không tìm thấy nhân viên nào
                </td>
              </tr>
            ) : (
              currentUsers.map((user, index) => (
                <tr key={user?.id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                      {user?.image ? (
                        <img
                          src={user.image || "/placeholder.svg"}
                          alt="Profile"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Back về avatar default
                            e.target.style.display = "none";
                            e.target.parentNode.querySelector(
                              ".default-avatar"
                            ).style.display = "block";
                          }}
                        />
                      ) : null}
                      <svg
                        className="w-10 h-10 text-gray-400 default-avatar"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        style={{ display: user?.image ? "none" : "block" }}
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user?.fullname || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span>{user?.role?.rolename || "N/A"}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user?.username || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/* Disable nút thay đổi trạng thái của tkhoan hiện tại */}
                    {isCurrentUser(user) ? (
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium cursor-not-allowed opacity-60 ${
                          user?.status === "1"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user?.status === "1" ? "Active" : "Inactive"}
                      </span>
                    ) : (
                      <button
                        onClick={() => handleStatusClick(user)}
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium transition-colors hover:opacity-80 ${
                          user?.status === "1"
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                      >
                        {user?.status === "1" ? "Active" : "Inactive"}
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {/* Ko edit thông tin của system admin */}
                      {user?.role?.rolename !== "System admin" && (
                        <button
                          onClick={() => handleEditClick(user)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <FontAwesomeIcon
                            icon={faPenToSquare}
                            className="h-4 w-4"
                          />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Trang {currentPage} của {totalPages}
          </div>
          <div className="flex items-center gap-2">
            {/* PREV BTN */}
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <FontAwesomeIcon icon={faChevronLeft} className="h-4 w-4 mr-1" />
              Trước
            </button>
            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {getPageNumbers().map((pageNum, index) => (
                <div key={index}>
                  {pageNum === "..." ? (
                    <span className="px-3 py-2 text-sm text-gray-500">...</span>
                  ) : (
                    <button
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        currentPage === pageNum
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  )}
                </div>
              ))}
            </div>
            {/* NEXT BTN */}
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Sau
              <FontAwesomeIcon icon={faChevronRight} className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      )}
      {/* Modal confirm trạng thái */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-200 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Xác nhận thay đổi trạng thái
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Bạn có chắc chắn muốn thay đổi trạng thái của người dùng{" "}
              <span className="font-medium text-gray-900">
                {selectedUser?.fullname}
              </span>{" "}
              từ{" "}
              <span
                className={`font-medium ${
                  selectedUser?.status === "1"
                    ? "text-green-600"
                    : "text-gray-600"
                }`}
              >
                {selectedUser?.status === "1" ? "Active" : "Inactive"}
              </span>{" "}
              thành{" "}
              <span
                className={`font-medium ${
                  selectedUser?.status === "1"
                    ? "text-gray-600"
                    : "text-green-600"
                }`}
              >
                {selectedUser?.status === "1" ? "Inactive" : "Active"}
              </span>
              ?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelStatusChange}
                disabled={isUpdating}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmStatusChange}
                disabled={isUpdating}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isUpdating ? "Đang cập nhật..." : "Xác nhận"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal conflict vị trí */}
      {showRoleConflictModal && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-200 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Xác nhận thay đổi trạng thái
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Hệ thống hiện đang có{" "}
              <span className="font-medium text-gray-900">
                {conflictingUser?.fullname}
              </span>{" "}
              với vị trí{" "}
              <span className="font-medium text-gray-900">
                {selectedUser?.role?.rolename}
              </span>{" "}
              ở trạng thái Active. Bạn có muốn deactive {" "}
              <span className="font-medium text-gray-900">
                {conflictingUser?.fullname}
              </span>{" "} và active{" "}
              <span className="font-medium text-gray-900">
                {selectedUser?.fullname}
              </span>{" "}
              không?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelRoleConflict}
                disabled={isUpdating}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
              >
                Không
              </button>
              <button
                onClick={() => handleRoleConflictConfirm(true)}
                disabled={isUpdating}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isUpdating ? "Đang cập nhật..." : "Có"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Edit User Modal */}
      {showEditModal && (
        <EditUserModal
          user={editingUser}
          users={users}
          onSuccess={handleEditSuccess}
          onCancel={() => {
            setShowEditModal(false);
            setEditingUser(null);
          }}
        />
      )}
      {/* Create User Modal */}
      {showCreateModal && (
        <CreateUserModal
          users={users}
          onSuccess={handleCreateSuccess}
          onCancel={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
};

export default AccountManage;
