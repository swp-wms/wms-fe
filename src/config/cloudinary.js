export const CLOUDINARY_CONFIG = {
  CLOUD_NAME: "dumfnp5uy",
  UPLOAD_PRESET: "Dat Viet WHMS User Image",
  MAX_FILE_SIZE: 5000000000,
  ALLOWED_FORMATS: ["jpg", "jpeg", "png", "gif"],
  FOLDER: "Dat Viet WHMS User Image",
  EAGER_TRANSFORMATIONS: [
    { width: 400, height: 400, crop: "fill" }, // Ảnh chính
    { width: 100, height: 100, crop: "fill" }, // Thumbnail
  ],
}