const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,"./ImageUploads/ProgressTracker")
    },
    filename: (req, file, cb) => {
        cb(null,`ProgressImage - ${Date.now()}-${ file.originalname }`)
    }

})

const fileFilter = (req,file,cb)=>{
    if(file.mimetype=='image/jpeg'||file.mimetype=='image/jpg'||file.mimetype=='image/png'){
        cb(null,true)
    }else{
        cb(null,false)
        return cb(new Error ("Accepts only png, jpg and jpeg files"))
    }
}

const multerConfig = multer({
    storage, 
    fileFilter
})

module.exports = multerConfig