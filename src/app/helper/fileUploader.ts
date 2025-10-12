import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";


//multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "/uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });



//cloudinary

const uploadToCloudinary = async(file: Express.Multer.File) =>{

}