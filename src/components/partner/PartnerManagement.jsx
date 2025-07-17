import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
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
    setCurrentPage(1);
  };

  const handleAddPartner = async (partnerData) => {
    try {
      await partner.addPartner(partnerData);
      await loadPartners();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding partner:", error);
      throw error;
    }
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

  // Pagination
  const indexOfLastPartner = currentPage * partnersPerPage;
  const indexOfFirstPartner = indexOfLastPartner - partnersPerPage;
  const currentPartners = filteredPartners.slice(
    indexOfFirstPartner,
    indexOfLastPartner
  );
  const totalPages = Math.ceil(filteredPartners.length / partnersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

      {/* PAGING */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={`w-3 h-3 rounded-full ${
                  currentPage === i + 1 ? "bg-gray-800" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* ADD MODAL */}
      <AddPartnerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleAddPartner}
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
