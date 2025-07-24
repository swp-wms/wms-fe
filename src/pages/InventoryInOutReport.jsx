import { useState,useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import React from "react";
import product from "../backendCalls/product";
import partner from "../backendCalls/partner";
import toast from "react-hot-toast";
import report from "../backendCalls/report";
import { getUser } from "../backendCalls/user";


const InventoryInOutReport = ({ user, setUser }) => {

    const [reportList, setReportList] = useState([]);
    const [partnerList, setPartnerList] = useState([]);

    const [searchParams,setSearchParams] = useSearchParams();
    const [partnerId, setPartnerId] = useState(searchParams.get('partnerid') || '');
    const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
    const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');
    const [searchKeyword, setSearchKeyword] = useState(searchParams.get('searchKeyword') || '');

    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        console.log("Current user:", user);
        if (user == null) {
          const getData = async () => {
            const response = await getUser();
            if (response.status !== 200) {
              window.location.href = '/dang-nhap';
            } else {
              const user = response.data;
              setUser(user);
            }
          };
          getData();
        }
      }, [user]);

    useEffect(() => {
        const fetchPartners = async () => {
          try {
            const response = await partner.fetchPartners();
            setPartnerList(response);
          } catch (error) {
            console.error("Error fetching partners:", error);
          }
        };
        fetchPartners();
    }, []);

    useEffect(() => {

    },[])

    const handleSearch =  () => {
        const params ={};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        if (searchKeyword) params.searchKeyword = searchKeyword;
        if (partnerId) params.partnerid = partnerId;

        setSearchParams(params);
    };
     useEffect(() => {
        const fetchReport = async () => {
        try{

            setLoading(true);
            const params = {
                startDate: searchParams.get('startDate'),
                endDate: searchParams.get('endDate'),
                partnerid: searchParams.get('partnerid'),
                searchKeyword: searchParams.get('searchKeyword')
            };

            Object.keys(params).forEach(key => {
                if(!params[key]) delete params[key];
            });

            const response = await report.fetchInventoryInOutReport(params);
            setReportList(response.data);
            
        }catch(error){
              console.error("Error fetching inventory data:", error);
            toast.error("Lỗi khi tải dữ liệu thống kê");
        }
        finally {
            setLoading(false);
        }

    };
        fetchReport();
    }, [searchParams]);
    

    return (
        <>
            {/* Main Content */}
            <div className="flex-1 ml-80 pt-25">
                {/* Page Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Thống kê xuất nhập tồn</h1>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <label className="text-sm text-gray-600">Từ ngày:</label>
                            <input type="date" onChange={(e) => setStartDate(e.target.value)} className="border border-gray-300 rounded px-3 py-2 text-sm" value={startDate} />

                        </div>
                        <div className="flex items-center space-x-1">
                            <label className="text-sm text-gray-600">Đến ngày:</label>
                            <input type="date" onChange={(e) => setEndDate(e.target.value)} className="border border-gray-300 rounded px-3 py-2 text-sm" value={endDate} />
                        </div>
                        <div className="flex items-center space-x-2">
                            <label className="text-sm text-gray-600">Tìm kiếm:</label>
                            <input type="text"
                                   className="border border-gray-300 rounded px-3 py-2 text-sm"
                                   onChange={(e) =>{setSearchKeyword(e.target.value);}}
                                   value={searchKeyword}
                                   placeholder="Nhập mã hoặc tên hàng hóa"/>
                        </div>
                        
                        <button onClick={handleSearch}
                                className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-700">
                            <i className="fas fa-search mr-2"></i>Tìm kiếm
                        </button>
                        
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                        <label className="text-sm text-gray-600">Đối tác:</label>
                        <select onChange={(e) => setPartnerId(e.target.value)} className="border border-gray-300 rounded px-3 py-2 text-sm" value={partnerId}>
                            <option value="">-- Chọn đối tác --</option>
                                {partnerList.map((partner,idx) =>(
                                    <option key={idx} value={partner.id} >{partner.name}</option>
                                ))}
                        </select>
                    </div>
                </div>

                {/* Inventory Report Table */}
                <div className="bg-white rounded-lg shadow-sm border">
                    <div className="p-4 border-b">
                        <h2 className="font-semibold text-gray-800">Báo cáo xuất nhập tồn kho</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium text-gray-700 border-r">STT</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-700 border-r">Mã hàng hóa</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-700 border-r">Tên hàng hóa</th>
                                    <th className="px-4 py-3 text-center font-medium text-gray-700 border-r">ĐVT</th>
                                    <th className="px-4 py-3 text-right font-medium text-gray-700 border-r">Tồn đầu</th>
                                    <th className="px-4 py-3 text-right font-medium text-gray-700 border-r">SL Nhập</th>
                                    <th className="px-4 py-3 text-right font-medium text-gray-700 border-r">SL Xuất</th>
                                    <th className="px-4 py-3 text-right font-medium text-gray-700 border-r">Tồn cuối</th>
                                    <th className="px-4 py-3 text-center font-medium text-gray-700 border-r">ĐVT</th>
                                    <th className="px-4 py-3 text-right font-medium text-gray-700 border-r">Tồn đầu</th>
                                    <th className="px-4 py-3 text-right font-medium text-gray-700 border-r">SL Nhập</th>
                                    <th className="px-4 py-3 text-right font-medium text-gray-700 border-r">SL Xuất</th>
                                    <th className="px-4 py-3 text-right font-medium text-gray-700">Tồn cuối</th>

                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                               {reportList?.map((item,index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 border-r">{item.id}</td>
                                    <td className="px-4 py-3 border-r font-medium text-red-600">{item.name}</td>
                                    <td className="px-4 py-3 border-r">{item.namedetail}</td>
                                    <td className="px-4 py-3 text-center border-r">{item.unit1}</td>
                                    <td className="px-4 py-3 text-right border-r">{item.OpStockUnit1}</td>

                                    <td className="px-4 py-3 text-right border-r">{item.QantityInUnit1}</td>
                                    <td className="px-4 py-3 text-right border-r">{item.QantityOutUnit1}</td>

                                    <td className="px-4 py-3 text-right border-r">{item.EdStockUnit1}</td>

                                    <td className="px-4 py-3 text-center border-r">{item.unit2}</td>
                                    <td className="px-4 py-3 text-right border-r">{item.OpStockUnit2}</td>

                                    <td className="px-4 py-3 text-right border-r">{item.QantityInUnit2}</td>
                                    <td className="px-4 py-3 text-right border-r">{item.QantityOutUnit2}</td>

                                    <td className="px-4 py-3 text-right border-r">{item.EdStockUnit2}</td>

                                </tr>
                               ))}
                            </tbody>
                               
                            
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-4 py-3 border-t flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            Hiển thị 1-5 trong tổng số 25 bản ghi
                        </div>
                        <div className="flex space-x-1">
                            <button className="px-3 py-1 border rounded text-sm hover:bg-gray-50 disabled:opacity-50" disabled>
                                <i className="fas fa-chevron-left"></i>
                            </button>
                            <button className="px-3 py-1 border rounded text-sm bg-red-600 text-white">1</button>
                            <button className="px-3 py-1 border rounded text-sm hover:bg-gray-50">2</button>
                            <button className="px-3 py-1 border rounded text-sm hover:bg-gray-50">3</button>
                            <button className="px-3 py-1 border rounded text-sm hover:bg-gray-50">
                                <i className="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default InventoryInOutReport;