import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faSpinner } from "@fortawesome/free-solid-svg-icons";

const ImageUpload = ({ currentImage, onImageUpload, isEditing = false }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [showEditButton, setShowEditButton] = useState(false);

  const handleImageUpload = () => {
    setIsUploading(true);

    // Cloudinary upload widget configuration
    const widget = window.cloudinary.createUploadWidget(
      {
        // Thay thế bằng cloud name của bạn (lấy từ Cloudinary Dashboard)
        cloudName: "dumfnp5uy", // VÍ DỤ: thay bằng cloud name thực của bạn

        // Thay thế bằng upload preset đã tạo (phải là Unsigned mode)
        uploadPreset: "Dat Viet WHMS User Image", // VÍ DỤ: thay bằng preset name đã tạo

        sources: ["local", "camera"], // Cho phép upload từ máy tính và camera
        multiple: false, // Chỉ cho phép chọn 1 ảnh
        maxFileSize: 5000000, // 5MB
        clientAllowedFormats: ["jpg", "jpeg", "png", "gif"], // Các định dạng cho phép

        // Cấu hình crop
        cropping: true,
        croppingAspectRatio: 1, // Crop hình vuông (1:1)
        croppingDefaultSelectionRatio: 1,
        croppingShowDimensions: true,

        // Tự động resize ảnh
        eager: [{ width: 400, height: 400, crop: "fill" }],

        folder: "Dat Viet WHMS User Image", // Tạo folder để tổ chức ảnh

        // Tùy chọn giao diện
        theme: "minimal",

        // Tự động tag ảnh
        tags: ["profile", "user-avatar"],

        // Callback khi upload thành công
        resourceType: "image",
      },
      (error, result) => {
        setIsUploading(false);

        if (error) {
          console.error("Upload error:", error);

          // Error handling
          if (
            error.message &&
            error.message.includes("Invalid upload preset")
          ) {
            alert("Upload preset không hợp lệ. Vui lòng kiểm tra lại.");
          } else if (
            error.message &&
            error.message.includes("Invalid cloud name")
          ) {
            alert("Cloud name không hợp lệ. Vui lòng kiểm tra lại.");
          } else {
            alert("Có lỗi xảy ra khi upload ảnh. Vui lòng thử lại.");
          }
          return;
        }

        if (result.event === "success") {
          console.log("Upload successful:", result.info);
          // Sử dụng URL đã được transform (nếu có eager transformation)
          const imageUrl =
            result.info.eager && result.info.eager.length > 0
              ? result.info.eager[0].secure_url
              : result.info.secure_url;

          onImageUpload(imageUrl);
        }
      }
    );

    widget.open();
  };

  return (
    <div
      className="relative w-40 h-40 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden group cursor-pointer"
      onMouseEnter={() => setShowEditButton(true)}
      onMouseLeave={() => setShowEditButton(false)}
      onClick={isEditing ? handleImageUpload : undefined}
    >
      {currentImage ? (
        <img
          src={currentImage || "/placeholder.svg"}
          alt="Profile"
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback nếu ảnh không load được
            e.currentTarget.style.display = "none";
            e.currentTarget.parentNode.querySelector(
              ".default-avatar"
            ).style.display = "block";
          }}
        />
      ) : null}
      <svg
        className="w-24 h-24 text-gray-400 default-avatar"
        fill="currentColor"
        viewBox="0 0 24 24"
        style={{ display: currentImage ? "none" : "block" }}
      >
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>

      {/* Edit overlay */}
      {isEditing && (showEditButton || isUploading) && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full transition-opacity">
          {isUploading ? (
            <div className="flex flex-col items-center">
              <FontAwesomeIcon
                icon={faSpinner}
                className="text-white text-2xl animate-spin mb-2"
              />
              <span className="text-white text-sm">Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <FontAwesomeIcon
                icon={faCamera}
                className="text-white text-2xl mb-2"
              />
              <span className="text-white text-sm">Edit</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
