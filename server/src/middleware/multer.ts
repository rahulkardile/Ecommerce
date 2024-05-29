import multer from "multer";
import { v4 as uuid } from "uuid"

const storage = multer.diskStorage({
destination(req, file, cb){
    cb(null, "uploads")
},

filename(req, file, cb){
    const id = uuid()
    cb(null, Date.now() + "_" + id  + "_" + file.originalname)
}
})

export const singleUpload = multer({storage}).single("photo");
