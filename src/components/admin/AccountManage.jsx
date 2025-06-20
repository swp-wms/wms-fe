import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faSave, faBackward, faPlus } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { getAllUserInfo, updateUserInfo, createNewUser } from "../../backendCalls/userInfo";

const AccountManage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [users, setUsers] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    fullname: "",
    username: "",
    password: "",
    role: "",
  });
  const [isEditUpdating, setIsEditUpdating] = useState(false);

  // New states for create user functionality
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    fullname: "",
    username: "",
    password: "",
    role: "",
  });
  const [isCreating, setIsCreating] = useState(false);
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getAllUserInfo();
        if (response.status !== 200) {
          window.location.href = "/dang-nhap";
          return;
        }
        const userData = response.data;

        console.log("API Response:", userData);
        if (userData && userData.length > 0) {
          console.log(
            "First user status:",
            userData[0].status,
            typeof userData[0].status
          );
        }

        setUsers(Array.isArray(userData) ? userData : []);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUsers([]);
      }
    };
    getData();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user?.id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.fullname?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPosition =
      selectedPosition === "" || user?.role?.rolename === selectedPosition;

    return matchesSearch && matchesPosition;
  });

  const positions = [
    "Salesman",
    "Warehouse keeper",
    "Delivery staff",
    "System admin",
  ];

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleStatusClick = (user) => {
    setSelectedUser(user);
    setShowConfirmModal(true);
  };

  const handleConfirmStatusChange = async () => {
    if (!selectedUser) return;

    setIsUpdating(true);
    try {
      const newStatus = selectedUser.status === "1" ? "0" : "1";
      const updatedUserData = {
        ...selectedUser,
        status: newStatus,
      };
      const response = await updateUserInfo(updatedUserData);

      if (response.status === 200) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === selectedUser.id ? { ...user, status: newStatus } : user
          )
        );
        alert("Cập nhật trạng thái thành công!");
      } else {
        alert("Có lỗi xảy ra khi cập nhật trạng thái!");
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      alert("Có lỗi xảy ra khi cập nhật trạng thái!");
    } finally {
      setIsUpdating(false);
      setShowConfirmModal(false);
      setSelectedUser(null);
    }
  };

  const handleCancelStatusChange = () => {
    setShowConfirmModal(false);
    setSelectedUser(null);
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditFormData({
      fullname: user.fullname || "",
      username: user.username || "",
      password: "",
      role: user.role?.rolename || "",
    });
    setShowEditModal(true);
  };

  const handleEditFormChange = (field, value) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;

    setIsEditUpdating(true);
    try {
      const updatedUserData = {
        ...editingUser,
        fullname: editFormData.fullname,
        username: editFormData.username,
        ...(editFormData.password && { password: editFormData.password }),
        role: getRoleIdFromName(editFormData.role),
      };

      const response = await updateUserInfo(updatedUserData);

      if (response.status === 200) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === editingUser.id
              ? {
                  ...user,
                  ...updatedUserData,
                  role: { ...user.role, rolename: editFormData.role },
                }
              : user
          )
        );
        alert("Cập nhật thông tin thành công!");
        setShowEditModal(false);
        setEditingUser(null);
      } else {
        alert("Có lỗi xảy ra khi cập nhật thông tin!");
      }
    } catch (error) {
      console.error("Error updating user info:", error);
      alert("Có lỗi xảy ra khi cập nhật thông tin!");
    } finally {
      setIsEditUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingUser(null);
    setEditFormData({
      fullname: "",
      username: "",
      password: "",
      role: "",
    });
  };

  const handleCreateClick = () => {
    setCreateFormData({
      fullname: "",
      username: "",
      password: "",
      role: "",
    });
    setEmailError("");
    setShowCreateModal(true);
  };

  const handleCreateFormChange = (field, value) => {
    setCreateFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "username") {
      if (value && !validateEmail(value)) {
        setEmailError("Tên đăng nhập phải có định dạng email hợp lệ");
      } else {
        setEmailError("");
      }
    }
  };

  const handleCreateUser = async () => {
    // Validation
    if (
      !createFormData.fullname ||
      !createFormData.username ||
      !createFormData.password ||
      !createFormData.role
    ) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (!validateEmail(createFormData.username)) {
      alert("Tên đăng nhập phải có định dạng email hợp lệ!");
      return;
    }

    setIsCreating(true);
    try {
      const newUserData = {
        fullname: createFormData.fullname,
        username: createFormData.username,
        password: createFormData.password,
        role: getRoleIdFromName(createFormData.role),
      };

      const response = await createNewUser(newUserData);
      {console.log("New User Data:", newUserData)}
      {console.log("Response:", response)}

      if (response.status === 200 || response.status === 201) {
        // Refresh user list
        const getUsersResponse = await getAllUserInfo();
        if (getUsersResponse.status === 200) {
          setUsers(
            Array.isArray(getUsersResponse.data) ? getUsersResponse.data : []
          );
        }

        alert("Tạo tài khoản thành công!");
        setShowCreateModal(false);
      } else {
        alert("Có lỗi xảy ra khi tạo tài khoản!");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Có lỗi xảy ra khi tạo tài khoản!");
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancelCreate = () => {
    setShowCreateModal(false);
    setCreateFormData({
      fullname: "",
      username: "",
      password: "",
      role: "",
    });
    setEmailError("");
  };

  const getRoleIdFromName = (roleName) => {
    switch (roleName) {
      case "Salesman":
        return 3;
      case "Warehouse Keeper":
        return 4;
      case "Delivery Staff":
        return 5;
      case "System admin":
        return 1;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen mt-20 ml-75">
      {/* Search + Filter + Add */}
      <div className="flex items-center justify-between mb-6 gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="text-gray-400"
            />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm mã nhân viên, tên nhân viên"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Position Filter */}
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

        {/* Add Account Button */}
        <button
          onClick={handleCreateClick}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <span className="text-lg">+</span>
          <span>Thêm tài khoản</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                MÃ NHÂN VIÊN
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
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  Không tìm thấy nhân viên nào
                </td>
              </tr>
            ) : (
              filteredUsers.map((user, index) => (
                <tr key={user?.id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user?.id || "N/A"}
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
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEditClick(user)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <FontAwesomeIcon
                          icon={faPenToSquare}
                          className="h-4 w-4"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
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

      {/* Edit Form */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 relative">
            <div className="flex items-start gap-8">
              {/* Avatar */}
              <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                {/* Role dropdown */}
                <div className="w-40">
                  <select
                    value={editFormData.role}
                    onChange={(e) =>
                      handleEditFormChange("role", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="">Chọn vị trí</option>
                    {positions.map((position) => (
                      <option key={position} value={position}>
                        {position}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Form fields */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-4">
                  <label className="w-32 text-sm font-medium text-gray-700">
                    MÃ NHÂN VIÊN:
                  </label>
                  <input
                    type="text"
                    value={editingUser?.id || ""}
                    disabled
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="w-32 text-sm font-medium text-gray-700">
                    TÊN NHÂN VIÊN:
                  </label>
                  <input
                    type="text"
                    value={editFormData.fullname}
                    onChange={(e) =>
                      handleEditFormChange("fullname", e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="w-32 text-sm font-medium text-gray-700">
                    TÊN ĐĂNG NHẬP:
                  </label>
                  <input
                    type="text"
                    value={editFormData.username}
                    onChange={(e) =>
                      handleEditFormChange("username", e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="w-32 text-sm font-medium text-gray-700">
                    MẬT KHẨU:
                  </label>
                  <input
                    type="password"
                    value={editFormData.password}
                    onChange={(e) =>
                      handleEditFormChange("password", e.target.value)
                    }
                    placeholder="Để trống nếu không muốn thay đổi"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleSaveEdit}
                  disabled={isEditUpdating}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 min-w-[100px]"
                >
                  <FontAwesomeIcon icon={faSave} />
                  <span>{isEditUpdating ? "Đang lưu..." : "Lưu"}</span>
                </button>

                <button
                  onClick={handleCancelEdit}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 min-w-[100px]"
                >
                  <FontAwesomeIcon icon={faBackward} />
                  <span>Quay lại</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create User Form */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 relative">
            <div className="flex items-start gap-8">
              {/* Avatar */}
              <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                {/* Roles */}
                <div className="w-40">
                  <select
                    value={createFormData.role}
                    onChange={(e) =>
                      handleCreateFormChange("role", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="">Chọn vị trí</option>
                    {positions.map((position) => (
                      <option key={position} value={position}>
                        {position}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Form fields */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-4">
                  <label className="w-32 text-sm font-medium text-gray-700">
                    TÊN NHÂN VIÊN:
                  </label>
                  <input
                    type="text"
                    value={createFormData.fullname}
                    onChange={(e) =>
                      handleCreateFormChange("fullname", e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập tên nhân viên"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="w-32 text-sm font-medium text-gray-700">
                    TÊN ĐĂNG NHẬP:
                  </label>
                  <div className="flex-1">
                    <input
                      type="email"
                      value={createFormData.username}
                      onChange={(e) =>
                        handleCreateFormChange("username", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        emailError ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="example@email.com"
                    />
                    {emailError && (
                      <p className="text-red-500 text-xs mt-1">{emailError}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="w-32 text-sm font-medium text-gray-700">
                    MẬT KHẨU:
                  </label>
                  <input
                    type="password"
                    value={createFormData.password}
                    onChange={(e) =>
                      handleCreateFormChange("password", e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập mật khẩu"
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleCreateUser}
                  disabled={isCreating || emailError}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 min-w-[100px]"
                >
                  <FontAwesomeIcon icon={faPlus} />
                  <span>{isCreating ? "Đang tạo..." : "Tạo"}</span>
                </button>

                <button
                  onClick={handleCancelCreate}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 min-w-[100px]"
                >
                  <FontAwesomeIcon icon={faBackward} />
                  <span>Quay lại</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountManage;
