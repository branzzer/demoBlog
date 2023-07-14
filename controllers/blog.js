const getAddNew = (req, res) => {

    return res.render('addBlog', {
        user: req.user
    })
}


const getBlog = async (req, res) => {

    const blog = await Blog.findById(req.params.id).populate('createdBy')
    return res.render('blog', {
        user: req.user,
        blog,
    })
}


const postBlog = async (req, res) => {


    const { title, body } = req.body

    const blog = await Blog.create({
        title,
        body,
        createdBy: req.user._id,
        coverImageURL: `/uploads/${req.file.filename}`
    })
    return res.redirect(`blog/${blog._id}`)
}


module.exports = {
    getAddNew,
    getBlog,
    postBlog,
}