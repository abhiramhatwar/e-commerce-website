//Multer middleware for handling image data
const multer = require("multer");

//Local Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// File filters and size limit
const upload = multer({
  storage: storage,
  limits: 1024 * 1024 * 10,
  fileFilter: (req, file, cb) => {
    //Accept only image files
    if (file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/png")
      return cb(null, true);
    else {
      //Throw error if invalid type
      cb(new Error("Invalid file type"));
    }
  },
});

module.exports = upload;
