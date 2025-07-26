import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import partner from "../../backendCalls/partner";
import AddPartnerModal from "./AddPartnerModal";
import PartnerDetailModal from "./PartnerDetailModal";

const PartnerManagement = () => {
  const [partners, setPartners] = useState([]);
  const [filteredPartners, setFilteredPartners] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const partnersPerPage = 5;

  useEffect(() => {
    loadPartners();
  }, []);

  useEffect(() => {
    filterPartners();
  }, [partners, searchTerm, filterType]);

  // Reset trang khi filter / search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType]);

  const loadPartners = async () => {
    try {
      const data = await partner.fetchPartners();
      setPartners(data);
    } catch (error) {
      console.error("Error loading partners:", error);
    }
  };

  const filterPartners = () => {
    let filtered = partners;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (partner) =>
          partner.id
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          partner.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter((partner) => {
        if (filterType === "factory") {
          return partner.isfactory === true;
        } else if (filterType === "non-factory") {
          return partner.isfactory === false;
        }
        return true;
      });
    }

    // Sort by ID (ascending order)
    filtered = filtered.sort((a, b) => {
      const idA = a.id || "";
      const idB = b.id || "";
      return idA.toString().localeCompare(idB.toString());
    });

    setFilteredPartners(filtered);
  };

  const handleAddPartner = async () => {
    await loadPartners();
    setIsModalOpen(false);
  };

  const handlePartnerClick = (partnerData) => {
    setSelectedPartner(partnerData);
    setIsDetailModalOpen(true);
  };

  const handlePartnerUpdate = async () => {
    await loadPartners();
    setIsDetailModalOpen(false);
    setSelectedPartner(null);
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredPartners.length / partnersPerPage);
  const startIndex = (currentPage - 1) * partnersPerPage;
  const endIndex = startIndex + partnersPerPage;
  const currentPartners = filteredPartners.slice(startIndex, endIndex);

  // Pagination handlers
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

  // Generate page numbers for pagination
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
    <div className="p-6 max-w-6xl mx-auto mt-20 ml-75">
      {/* SEARCH + FILTER + BUTTON */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* SEARCH */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Tìm kiếm mã khách hàng, tên công ty"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* FILTER */}
        <div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-32"
          >
            <option value="all">Tất cả</option>
            <option value="factory">Nhà máy</option>
            <option value="non-factory">Không phải nhà máy</option>
          </select>
        </div>

        {/* ADD BUTTON */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 whitespace-nowrap"
        >
          <FontAwesomeIcon icon={faPlus} />
          Thêm đối tác
        </button>
      </div>

      {/* Results Info */}
      <div className="mb-4 text-sm text-gray-600">
        Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredPartners.length)}{" "}
        của {filteredPartners.length} kết quả
      </div>

      {/* PARTNER LIST */}
      <div className="space-y-4">
        {currentPartners.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Không tìm thấy đối tác nào
          </div>
        ) : (
          currentPartners.map((partnerItem, index) => (
            <div
              key={partnerItem.id || index}
              className="border border-gray-300 rounded-lg p-4 bg-white cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => handlePartnerClick(partnerItem)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">
                    [{partnerItem.id || "MÃ CÔNG TY"}] - [
                    {partnerItem.name || "TÊN CÔNG TY"}]
                  </h3>
                  <p className="text-gray-600">
                    <span className="font-medium">Địa chỉ:</span>{" "}
                    {partnerItem.address || "Chưa có thông tin"}
                  </p>
                </div>
                {partnerItem.isfactory && (
                  <div className="bg-gray-100 px-3 py-1 rounded text-sm font-medium">
                    NHÀ MÁY
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Trang {currentPage} của {totalPages}
          </div>
          <div className="flex items-center gap-2">
            {/* Previous Button */}
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

            {/* Next Button */}
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

      {/* ADD MODAL */}
      <AddPartnerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleAddPartner}
        allPartners={partners}
      />

      {/* DETAIL MODAL */}
      <PartnerDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedPartner(null);
        }}
        partner={selectedPartner}
        onUpdate={handlePartnerUpdate}
        allPartners={partners}
      />
    </div>
  );
};

export default PartnerManagement;
