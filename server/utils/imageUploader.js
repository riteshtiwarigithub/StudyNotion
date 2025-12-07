const cloudinary = require("cloudinary").v2;

exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
  try {
    const options = { folder, resource_type: "auto" };

    if (height) options.height = height;
    if (quality) options.quality = quality;

    console.log("📤 Uploading to Cloudinary with options:", options);
    console.log("🖼️ File Path:", file?.tempFilePath);

    if (!file?.tempFilePath) {
      throw new Error("tempFilePath missing — check express-fileupload setup");
    }

    const result = await cloudinary.uploader.upload(file.tempFilePath, options);
    console.log("✅ Cloudinary upload success:", result.secure_url);
    return result;
  } catch (error) {
    console.error("❌ Cloudinary Upload Error:", error);
    throw error;
  }
};
