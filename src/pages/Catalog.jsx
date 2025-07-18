import React ,{useState,useEffect} from 'react';
import { useParams, Link, useNavigate } from "react-router-dom";
import { getUser } from "../backendCalls/user";
import  catalog from '../backendCalls/catalog';
import { CatalogForm } from '../components/order/CatalogForm';
import toast, { Toaster } from 'react-hot-toast';

const Catalog = ({user, setUser}) => {
    const [catalogBrands, setCatalogBrands] = useState([]);
    const [catalogData, setCatalogData] = useState([]);
    const [showCatalogForm, setShowCatalogForm] = useState(false);
    const [catalogDataEdit, setCatalogDataEdit] = useState([]);
    const [showEditForm, setShowEditForm] = useState(false);
    const [refresh, setRefresh] = useState(false);
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
            if(response.status == 200){
                setCatalogBrands(response.data);
            } else {
                console.error("Failed to fetch catalog brands");
            }
        };
        fetchBrands();
      }, [refresh]);

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
      }, [refresh]);

    const toggleEdit=() => {
        setShowEditForm(!showEditForm);
        // if(showEditForm){
        //     setCatalogDataEdit(catalogData);
        // } else {
        //     setCatalogDataEdit([]);
        // }

        setCatalogDataEdit(catalogData);
    }


    const handleInputChange = (e, steeltype, brandname, field) => {
        const {value} = e.target;
        
        

    setCatalogDataEdit((prev) => (
    prev.map(item => { 
        // find by primary key
        if (item.steeltype === steeltype && item.brandname === brandname) {
            const updateItem = { ...item, [field]: value };
            
            //caculate 
            // if(['weightperbundle', 'barsperbundle'].includes(field)){
            //     if(updateItem.barsperbundle && updateItem.weightperbundle){
            //         updateItem.length = (updateItem.weightperbundle / updateItem.barsperbundle).toFixed(3);
            //     }
            // }

            // if(['weightperbundle', 'length','barsperbundle'].includes(field)){
            //     if(updateItem.length && updateItem.weightperbundle && updateItem.barsperbundle){
            //         console.log(`Data: {length: ${item.length}, weightperbundle: ${item.weightperbundle}, barsperbundle: ${item.barsperbundle}}`)
            //         updateItem.weightpermeter = Number((updateItem.weightperbundle / updateItem.barsperbundle / 11.7).toFixed(3));

            //     }
            // }
            return updateItem;
        }
        return item;
    })

    ));
    }

    const handleSaveChanges = async () => {
        
            const response = await catalog.updateCatalog(catalogDataEdit);
            // Adjust according to your backend response structure
            if (response.status == 201 || response.status == 200) {
                
                setShowEditForm(false);
                setRefresh(!refresh);
                toast.success("Lưu thay đổi thành công");
            } else {
                console.error("Error to save catalog changes", response);
                toast.error("Lưu thay đổi không thành công");
            }
        
        
    };

    return(
        
        <div className=" mt-25 max-w-7xl ml-75 px-4 sm:px-6 lg:px-8 py-8">
            <div className="static flex mb-6 pb-4 border-b border-gray-300">
                <div className="w-[50%]">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                   
                </div>
                <div className="flex ml-auto gap-2">
                  <button onClick={toggleEdit} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-xs text-black hover:bg-gray-50 shadow-lg">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Chỉnh sửa
                  </button>
                  {showEditForm && (
                    <button onClick={() => setShowEditForm(false)} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-xs text-black hover:bg-gray-50 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                    </svg>

                    Huỷ thay đổi
                  </button>
                  )}

                   {showEditForm && (
                    <button onClick={handleSaveChanges} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-xs text-black hover:bg-gray-50 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 mr-1">
                       
                        <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                    </svg>


                    Lưu thay đổi
                  </button>
                  )}

                {!showEditForm && (
                  <button onClick={() => setShowCatalogForm(true)} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-xs text-black hover:bg-gray-50 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 mr-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                    Thêm mới
                  </button>
                )}
                </div>
            </div>
            

            {showCatalogForm && ( 
                <CatalogForm 
                    setShowForm={setShowCatalogForm}
                    setCatalogData={setCatalogData}
                    refresh={refresh}
                    setRefresh={setRefresh} />
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
                                            <th className="px-4 py-3 text-center border border-gray-400 font-medium text-gray-700" rowSpan={2}>Loại thép</th>
                                            <th className="px-4 py-3 text-center border border-gray-400 font-medium text-gray-700" rowSpan={2}>QD cây / bó</th>
                                            <th className="px-4 py-1 text-center border border-gray-400 font-medium text-gray-700" colSpan={4}>{brand.standard}</th>
                                        </tr>
                                        <tr>
                                            <th className="px-4 py-3 text-center border border-gray-400 font-medium text-gray-700">Kg/m</th>
                                            <th className="px-4 py-3 text-center border border-gray-400 font-medium text-gray-700">Kg / cây </th>
                                            <th className="px-4 py-3 text-center border border-gray-400 font-medium text-gray-700">Khối lượng bó/ cuộn</th>
                                            {/* <th className="px-4 py-3 text-center border border-gray-400 font-medium text-gray-700">Dung sai %</th> */}
                                        </tr>
                                    </thead>
                                   {showEditForm && (
                                        <tbody className="divide-y border border-gray-400 divide-gray-100">
                                        {catalogDataEdit
                                            .filter(item => item.brandname === brand.brandname && item.standard === brand.standard)
                                            .map((item) => (
                                                <tr key={item.id || item.steeltype} className="hover:bg-gray-50 border border-gray-400">
                                                    <td className="p-0 border border-gray-400">
                                                        <input 
                                                        type="text" 
                                                        className="w-full h-full px-4 py-3 font-medium text-gray-900 border-0 bg-transparent focus:outline-none focus:ring-0" 
                                                        value={item.steeltype}
                                                        disabled
                                                        
                                                        />
                                                    </td>
                                                    <td className="p-0 border border-gray-400">
                                                        <input 
                                                        type="text" 
                                                        className="w-full h-full px-4 py-3 font-medium text-gray-900 border-0 bg-transparent focus:outline-none focus:ring-0" 
                                                        value={item.type}
                                                        disabled
                                                        
                                                        />
                                                    </td>
                                                    <td className="p-0 border border-gray-400 hover:bg-gray-300">
                                                        <input 
                                                        type="text" 
                                                        className="w-full h-full px-4 py-3 text-gray-700 border-0 bg-transparent focus:outline-none focus:ring-0 disabled:bg-gray-200" 
                                                        value={item?.type === "Thép Thanh"? item?.barsperbundle : ""}
                                                        disabled={ item?.type !== "Thép Thanh"}
                                                        onChange={(e)=> handleInputChange(e, item.steeltype, item.brandname,'barsperbundle')}
                                                        />
                                                    </td>
                                                    <td className="p-0 border border-gray-400 hover:bg-gray-300">
                                                        <input 
                                                        type="text" 
                                                        className="w-full h-full px-4 py-3 text-gray-700 border-0 bg-transparent focus:outline-none focus:ring-0 disabled:bg-gray-200" 
                                                        value={item?.type === "Thép Thanh"?(item?.weightperbundle / item?.barsperbundle / item?.length).toFixed(3):""}
                                                        onChange={(e)=> handleInputChange(e, item.steeltype, item.brandname,'weightpermeter')}
                                                        disabled={ item?.type !== "Thép Thanh"}
                                                        />
                                                    </td>
                                                    <td className="p-0 border border-gray-400 hover:bg-gray-300">
                                                        <input 
                                                        type="text" 
                                                        className="w-full h-full px-4 py-3 text-gray-700 border-0 bg-transparent focus:outline-none focus:ring-0 " 
                                                        value={item?.type === "Thép Thanh"?(item?.weightperbundle / item?.barsperbundle).toFixed(2):""}
                                                        disabled
                                                        />
                                                    </td>
                                                    <td className="p-0 border border-gray-400 hover:bg-gray-300">
                                                        <input type="text" className="w-full h-full px-4 py-3 text-gray-700 border-0 bg-transparent focus:outline-none focus:ring-0" 
                                                        value={item?.weightperbundle}
                                                        onChange={(e)=> handleInputChange(e, item.steeltype, item.brandname,'weightperbundle')}
                                                        />
                                                    </td>
                                                    {/* <td className="p-0 border border-gray-400 hover:bg-gray-300"><input 
                                                        type="text" 
                                                        className="w-full h-full px-4 py-3 text-gray-700 border-0 bg-transparent focus:outline-none focus:ring-0" 
                                                        value="007"
                                                        onChange={(e)=> handleInputChange(e, item.steeltype, item.brandname,)}  
                                                        />
                                                    </td> */}
                                                    </tr>
                                            ))}
                                    </tbody>
                                    )}


                                    {!showEditForm && (
                                    <tbody className="divide-y border border-gray-400 divide-gray-200">
                                        {catalogData
                                            .filter(item => item.brandname === brand.brandname && item.standard === brand.standard)
                                            .map((item) => (
                                                <tr key={item.id || item.steeltype} className=  "hover:bg-gray-200 border border-gray-400">
                                                    <td className="px-4 py-3 font-medium text-gray-900">{item.steeltype}</td>
                                                    <td className="px-4 py-3 text-gray-700 border border-gray-400" >{item.type}</td>
                                                    <td className="px-4 py-3 text-gray-700 border border-gray-400">{item.type === "Thép Thanh"? item?.barsperbundle : null}</td>
                                                    <td className="px-4 py-3 text-gray-700 border border-gray-400">{item.type === "Thép Thanh"? (item?.weightperbundle / item?.barsperbundle / item?.length).toFixed(3) : null}</td>
                                                    <td className="px-4 py-3 text-gray-700 border border-gray-400">{item.type === "Thép Thanh"? (item?.weightperbundle / item?.barsperbundle).toFixed(2) : null}</td>
                                                    <td className="px-4 py-3 text-gray-700 border border-gray-400">{item.type === "Thép Thanh"? item?.weightperbundle : item?.weightperroll}</td>
                                                    {/* <td className="px-4 py-3 text-gray-700 border border-gray-400">007</td> */}
                                                </tr>
                                            ))}
                                    </tbody>
                                    )}
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