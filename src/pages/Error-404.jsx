import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { getUser } from "../backendCalls/user";
const Error404 = ({user, setUser}) => {
    useEffect(() => {
        if (!user) {
            const getData = async () => {
                const response = await getUser();
                if (response.status !== 200) {
                    window.location.href = '/dang-nhap';
                } else {
                    const userData = response.data;
                    setUser(userData);
                }
            };
            getData();
        }
    }, [user, setUser]);
    
    return(
    <div className="min-h-screen flex bg-gray-50">
      
      <div className="flex-1">
        
        
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12 pt-30">
              {/* Error Illustration */}
              <div className="mb-8 flex justify-center">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300" 
                    alt="Empty warehouse representing 404 error" 
                    className="rounded-xl shadow-lg max-w-md w-full opacity-75"
                  />
                  
                  {/* 404 Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white bg-opacity-90 rounded-lg p-6 shadow-lg">
                      <div className="text-6xl font-bold text-red-600">404</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Không tìm thấy trang yêu cầu
              </h1>
              
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Trang bạn đang tìm kiếm có thể đã được di chuyển, xóa hoặc không tồn tại. 
                Vui lòng kiểm tra lại đường dẫn hoặc quay về trang chủ.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
               
                <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium">
                    <p className="w-4 h-4 mr-2" >
                    Về trang chủ
                    </p>
                </button>
                
                
                <button 
                  variant="outline"
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium"
                >
                  Quay lại
                </button>
              </div>

         
             
              {/* Support Information */}
            
            </div>
          </div>
        
      </div>
    </div>
    )
}
export default Error404;
