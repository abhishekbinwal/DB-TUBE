// import { v2 as cloudinary } from "cloudinary";

// import fs from "fs";

// import dotenv from "dotenv";

// dotenv.config();

// //configure cloudinary

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // for uploading files on cloudinary
// const uploadOnCloudinary = async (localFilePath) => {
//   try {
//     if (!localFilePath) return null;
//     const response = await cloudinary.uploader.upload(localFilePath, {
//       resource_type: "auto",
//     });
//     console.log("File uploaded on cloudinary. File src:" + response.url);
//     // once the file is uploaded, we would like to delete it from our server

//     // prone to error
//     // fs.unlink(localFilePath);
//     // return response;

//     // ✅ FIX: Add callback to fs.unlink
//     fs.unlink(localFilePath, (err) => {
//       if (err) console.error("Failed to delete local file:", err);
//     });
//     return response;
//   } catch (error) {
//     // prone
//     // console.log("error on cloudinary", error);
//     //
//     console.error("Error uploading to Cloudinary:", error);

//     //

//     // prone to error
//     // fs.unlinkSync(localFilePath);
//     // fs.unlinkSync(localFilePath);

//     //
//     // ✅ FIX: Add callback to fs.unlink even on failure
//     fs.unlink(localFilePath, (err) => {
//       if (err) console.error("Cleanup failed:", err);
//     });

//     //
//     return null;
//   }
// };

// const deleteFromCloudinary = async (publicId) => {
//   try {
//     const result = await cloudinary.uploader.destroy(publicId);
//     console.log("deleted from cloudinary. public id :", publicId);
//   } catch (error) {
//     console.log("error deleting from cloudinary", error);
//     return null;
//   }
// };

// export { uploadOnCloudinary, deleteFromCloudinary };
/////////////////////////////////////
import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises"; // ✅ Use promises version
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload file to Cloudinary
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log("File uploaded on cloudinary. File src:" + response.url);

    // ✅ Delete local file safely
    try {
      await fs.unlink(localFilePath);
    } catch (err) {
      console.error("Failed to delete local file:", err);
    }

    return response; // ✅ FIXED
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);

    // ✅ Attempt cleanup even on failure
    try {
      await fs.unlink(localFilePath);
    } catch (err) {
      console.error("Cleanup failed:", err);
    }

    return null;
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Deleted from cloudinary. Public ID:", publicId);
  } catch (error) {
    console.log("Error deleting from cloudinary", error);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
