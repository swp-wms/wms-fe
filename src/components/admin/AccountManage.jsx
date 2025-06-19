import { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { getAllUserInfo, updateUserInfo } from "../../backendCalls/userInfo"

const AccountManage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPosition, setSelectedPosition] = useState("")
  const [users, setUsers] = useState([])
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getAllUserInfo()
        if (response.status !== 200) {
          window.location.href = "/dang-nhap"
          return
        }
        const userData = response.data

        // Debug: Kiểm tra cấu trúc dữ liệu
        console.log("API Response:", userData)
        if (userData && userData.length > 0) {
          console.log("First user status:", userData[0].status, typeof userData[0].status)
        }

        setUsers(Array.isArray(userData) ? userData : [])
      } catch (error) {
        console.error("Error fetching user data:", error)
        setUsers([])
      }
    }
    getData()
  }, [])

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user?.id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.fullname?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesPosition = selectedPosition === "" || user?.role === getRoleFromPosition(selectedPosition)

    return matchesSearch && matchesPosition
  })

  const getRoleFromPosition = (position) => {
    switch (position) {
      case "Salesman":
        return 3
      case "Warehouse Keeper":
        return 4
      case "Delivery Staff":
        return 5
      default:
        return null
    }
  }

  const positions = ["Salesman", "Warehouse Keeper", "Delivery Staff"]

  const handleStatusClick = (user) => {
    setSelectedUser(user)
    setShowConfirmModal(true)
  }

  const handleConfirmStatusChange = async () => {
    if (!selectedUser) return

    setIsUpdating(true)
    try {
      // Đảo ngược trạng thái: "1" -> "0", "0" -> "1"
      const newStatus = selectedUser.status === "1" ? "0" : "1"

      const updatedUserData = {
        ...selectedUser,
        status: newStatus,
      }
      {}
      const response = await updateUserInfo(updatedUserData)

      if (response.status === 200) {
        // Cập nhật state local
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === selectedUser.id ? { ...user, status: newStatus } : user)),
        )
        alert("Cập nhật trạng thái thành công!")
      } else {
        alert("Có lỗi xảy ra khi cập nhật trạng thái!")
      }
    } catch (error) {
      console.error("Error updating user status:", error)
      alert("Có lỗi xảy ra khi cập nhật trạng thái!")
    } finally {
      setIsUpdating(false)
      setShowConfirmModal(false)
      setSelectedUser(null)
    }
  }

  const handleCancelStatusChange = () => {
    setShowConfirmModal(false)
    setSelectedUser(null)
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen mt-20 ml-75">
      {/* Search + Filter + Add */}
      <div className="flex items-center justify-between mb-6 gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-400" />
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
            <option value="">Vị trí</option>
            {positions.map((position) => (
              <option key={position} value={position}>
                {position}
              </option>
            ))}
          </select>
        </div>

        {/* Add Account Button */}
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">VỊ TRÍ</th>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user?.id || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user?.fullname || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span>{user?.role?.rolename || "N/A"}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user?.username || "N/A"}</td>
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
                      <button className="text-gray-400 hover:text-gray-600 transition-colors">
                        <FontAwesomeIcon icon={faPenToSquare} className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex space-x-1">
            <button className="w-8 h-8 rounded bg-blue-500 text-white text-sm">1</button>
            <button className="w-8 h-8 rounded text-gray-500 hover:bg-gray-100 text-sm">2</button>
            <button className="w-8 h-8 rounded text-gray-500 hover:bg-gray-100 text-sm">3</button>
            <span className="w-8 h-8 flex items-center justify-center text-gray-400">...</span>
            <button className="w-8 h-8 rounded text-gray-500 hover:bg-gray-100 text-sm">10</button>
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Xác nhận thay đổi trạng thái</h3>
            <p className="text-sm text-gray-500 mb-6">
              Bạn có chắc chắn muốn thay đổi trạng thái của người dùng{" "}
              <span className="font-medium text-gray-900">{selectedUser?.fullname}</span> từ{" "}
              <span className={`font-medium ${selectedUser?.status === "1" ? "text-green-600" : "text-gray-600"}`}>
                {selectedUser?.status === "1" ? "Active" : "Inactive"}
              </span>{" "}
              thành{" "}
              <span className={`font-medium ${selectedUser?.status === "1" ? "text-gray-600" : "text-green-600"}`}>
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
    </div>
  )
}

export default AccountManage
