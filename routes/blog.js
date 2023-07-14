const { Router } = require('express')
const { Blog } = require('../models/blog')
const multer = require('multer');
const path = require('path');
const { postBlog, getBlog, getAddNew } = require('../controllers/blog');

const router = Router()


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve('./public/uploads'));
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`
        cb(null, fileName)
    }
})

const upload = multer({ storage: storage })


router.get('/add-new', getAddNew)


router.get('/:id', getBlog)

router.post("/", upload.single('coverImage'), postBlog)



module.exports = router