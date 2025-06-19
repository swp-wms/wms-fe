import { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { getAllUserInfo } from "../../backendCalls/userInfo"

const AccountManage = () => {
  const [search, setSearch] = useState("")
  const [selectedPosition, setSelectedPosition] = useState("")
  const [users, setUsers] = useState([])

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getAllUserInfo()
        if (response.status !== 200) {
          window.location.href = "/dang-nhap"
          return
        }
        const userData = response.data
        // userData là Array để tách lấy thông tin
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
      user?.id?.toString().toLowerCase().includes(search.toLowerCase()) ||
      user?.fullname?.toLowerCase().includes(search.toLowerCase())
    const matchesPosition = selectedPosition === "" || user?.role === getRoleFromPosition(selectedPosition)
    return matchesSearch && matchesPosition
  })

  const positions = ["Salesman", "Warehouse Keeper", "Delivery Staff"]

  const getPositionColor = (position) => {
    switch (position) {
      case "Delivery Staff":
        return "text-red-600"
      case "Salesman":
        return "text-red-600"
      case "Warehouse Keeper":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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

        {/* Add Account */}
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
                  <td className="px-6 py-4 whitespace-normal text-sm font-medium text-gray-900">{user?.id || "N/A"}</td>
                  {console.log(user)}
                  <td className="px-6 py-4 whitespace-normal text-sm text-gray-900">{user?.fullname || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-normal text-sm">
                    <span>{user?.rolename}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user?.username || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        user?.status === 1 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user?.status === 1 ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-2 justify-center">
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
    </div>
  )
}

export default AccountManage
