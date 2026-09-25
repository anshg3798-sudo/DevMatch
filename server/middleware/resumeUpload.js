const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDirectory = path.join(
  __dirname,
  "../uploads/resumes"
);

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(
      file.originalname
    );

    const filename =
      `${req.user.id}-${Date.now()}${extension}`;

    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {


  if (
    file.mimetype === "application/pdf" ||
    path.extname(file.originalname).toLowerCase() ===
      ".pdf"
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only PDF resume files are allowed."
      ),
      false
    );
  }
};

const resumeUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = resumeUpload;