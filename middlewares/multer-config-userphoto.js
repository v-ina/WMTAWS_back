const multer = require('multer')


const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'jpg'
}


const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'userphotos')
    },
    filename: (req, file, callback) => {
        const name = req.body.username
        const extension = MIME_TYPES[file.mimetype]
        callback(null, name + '.' + extension)
    }
})


module.exports = multer({ storage: storage }).single('photo')