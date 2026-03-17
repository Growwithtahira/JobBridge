import multer from "multer";

const storage = multer.memoryStorage();

// Ye aapka pehle se hai (Register ya baaki jagah ke liye)
export const singleUpload = multer({ storage }).single("file");

// 👇 NAYA: Ye Edit Profile ke liye hai jahan Resume aur DP dono aa sakte hain
export const multiUpload = multer({ storage }).fields([
    { name: "file", maxCount: 1 },         // Resume ke liye
    { name: "profilePhoto", maxCount: 1 }  // Nayi DP ke liye
]);