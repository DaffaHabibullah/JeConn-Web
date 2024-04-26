const multer = require("multer");
const path = require("path");
const fs = require("fs");


const createStorage = (folderName) => multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = `/app/users/${req.user.id}/${folderName}`;
        fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const dir = `/app/users/${req.user.id}/${folderName}`;
        if (folderName === "profile") {
            const files = fs.readdirSync(dir);
            if (files.length >= 2) {
                const oldestFile = files.reduce((oldest, current) => {
                    const oldestTime = fs.statSync(path.join(dir, oldest)).mtime.getTime();
                    const currentTime = fs.statSync(path.join(dir, current)).mtime.getTime();
                    if (oldestTime < currentTime) {
                        return oldest;
                    } else {
                        return current;
                    }
                });
                fs.unlinkSync(path.join(dir, oldestFile));
            }
        }
        const filename = `${Date.now()}-${file.originalname.replace(/\s/g, "-")}`;
        cb(null, filename);
    },
});

const checkFileType = (file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);
    if (extName && mimeType) {
        cb(null, true);
    } else {
        cb(new Error("Only support .jpeg, .jpg, .png"));
    }
};

const uploadProfile = multer({
    storage: createStorage("profile"),
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => checkFileType(file, cb),
}).single("imageProfile");


module.exports = { uploadProfile };
