const multer = require("multer");
const { AppError } = require("../utils/errors");

const storage = multer.memoryStorage();

const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new AppError("Invalid file type", 400), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});

const uploadSingle = (fieldName) => (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return next(new AppError("File too large (max 5MB)", 400));
        }
        if (err) return next(err);
        next();
    });
};

module.exports = { uploadSingle };