import React ,{useState,useEffect} from 'react';
import { useParams, Link, useNavigate } from "react-router-dom";
import { getUser } from "../backendCalls/user";
import  catalog from '../backendCalls/catalog';
import { CatalogForm } from '../components/order/CatalogForm';

const Catalog = ({user, setUser}) => {
    const [catalogBrands, setCatalogBrands] = useState([]);
    const [catalogData, setCatalogData] = useState([]);
    const [showCatalogForm, setShowCatalogForm] = useState(false);
    useEffect(() => {
        console.log("Current user:", user);
        if (user == null) {
          const getData = async () => {
            const response = await getUser();
            if (response.status !== 200) {
              window.location.href = '/dang-nhap';
              }
          const user = response.data  ;
          setUser(user);
          }
          getData();
        }
      }, [user, setUser]);

    useEffect(() => {
        const fetchBrands = async () =>{
            const response = await catalog.fetchCatalogBrands();
            if(response.status === 200){
                setCatalogBrands(response.data);
            } else {
                console.error("Failed to fetch catalog brands");
            }
        };
        fetchBrands();
      }, []);

    useEffect(() => {
        const fetchData = async () =>{
            try{
            const response = await catalog.fetchCatalog();
            setCatalogData(response);
            console.log("Catalog data:", response);
            }catch(error){
                console.error("Failed to fetch catalog data:", error);
            }

        };
        fetchData();
      }, []);

    return(
        
        <div className=" mt-25 max-w-7xl ml-75 px-4 sm:px-6 lg:px-8 py-8">
            <div className="static flex mb-6 pb-4 border-b border-gray-300">
                <div className="w-[50%]">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        // ref={inputRef}
                        type="text"
                        placeholder="Tìm kiếm mã khách hàng, tên công ty"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                        // value={inputpartner}
                        // onChange={e => { handlePartnerInputChange(e); setShowSuggestions(true); }}
                        // onFocus={() => setShowSuggestions(true)}
                        // onBlur={handleBlur}
                        // onKeyDown={handleKeyDown}
                    />
                </div>
                <div className="flex ml-auto gap-2">
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-xs text-black hover:bg-gray-50 shadow-lg">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Chỉnh sửa
                  </button>
                  <button onClick={() => setShowCatalogForm(true)} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-xs text-black hover:bg-gray-50 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 mr-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                    Thêm mới
                  </button>
                </div>
            </div>
            

            {showCatalogForm && ( 
                <CatalogForm 
                    setShowForm={setShowCatalogForm}
                    setCatalogData={setCatalogData} />
                )}

            <div className="grid grid-cols-2 gap-4 shadow-sm border border-gray-200 overflow-hidden">
                {catalogBrands.length > 0 && (
                    catalogBrands.map((brand) => (   
                        <div key={brand.id || brand.brandname}>
                            <div className=" bg-gray-300 px-6 py-2 border border-gray-150">
                                <h2 className="text-lg text-center font-semibold text-gray-700">{brand.brandname}</h2> 
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-center border border-gray-400 font-medium text-gray-700 " rowSpan={2}>Loại</th>
                                            <th className="px-4 py-3 text-center border border-gray-400 font-medium text-gray-700" rowSpan={2}>QD cây / bó</th>
                                            <th className="px-4 py-1 text-center border border-gray-400 font-medium text-gray-700" colSpan={4}>{brand.standard}</th>
                                        </tr>
                                        <tr>
                                            <th className="px-4 py-3 text-center border border-gray-400 y-150 font-medium text-gray-700">Kg/m</th>
                                            <th className="px-4 py-3 text-center border border-gray-400 font-medium text-gray-700">Kg / cay bazem</th>
                                            <th className="px-4 py-3 text-center border border-gray-400 font-medium text-gray-700">Khối lượng bó bazem</th>
                                            <th className="px-4 py-3 text-center border border-gray-400 font-medium text-gray-700">Dung sai %</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y border border-gray-400 divide-gray-200">
                                        {catalogData
                                            .filter(item => item.brandname === brand.brandname && item.standard === brand.standard)
                                            .map((item) => (
                                                <tr key={item.id || item.steeltype} className="hover:bg-gray-50 border border-gray-400">
                                                    <td className="px-4 py-3 font-medium text-gray-900">{item.steeltype}</td>
                                                    <td className="px-4 py-3 text-gray-700 border border-gray-400">{item?.barsperbundle}</td>
                                                    <td className="px-4 py-3 text-gray-700 border border-gray-400">{(item?.weightperbundle / item?.barsperbundle / item?.length).toFixed(3)}</td>
                                                    <td className="px-4 py-3 text-gray-700 border border-gray-400">{(item?.weightperbundle / item?.barsperbundle).toFixed(2)}</td>
                                                    <td className="px-4 py-3 text-gray-700 border border-gray-400">{item?.weightperbundle}</td>
                                                    <td className="px-4 py-3 text-gray-700 border border-gray-400">007</td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))
                )}
            </div>
            
        </div>
    )
}

export default Catalog;