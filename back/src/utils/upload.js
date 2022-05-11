import multer from 'multer';
import __dirname from '../utils.js';

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'src/public/img')
    },
    filename:function(req, file, cb){
        cb(null, Date.now()+file.originalname)
    }
});
const upload = multer({storage:storage});

export default upload;
 