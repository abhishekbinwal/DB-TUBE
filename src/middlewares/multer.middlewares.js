import multer from "multer";

// read multer documentation to extra knowledge
// different codes for single image upload and multiple file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //  single . for current directory and .. for one directory next to present directory
    // public folder ke ander temp folder hona chaheye nahi to khatarnaak bug , error aaega..
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    // optional , later can uncomment
    //  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, file.originalname);
  },
});

// cb is for call back

export const upload = multer({ storage });
