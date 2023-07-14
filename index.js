const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const UserRouter = require('./routes/user');
const BlogRouter = require('./routes/blog')
const { connectDB } = require('./config');
const { checkForAuthenticationCookies } = require('./middlewares/authentication');
const { Blog } = require('./models/blog');
const app = express();
const PORT = 8000

connectDB()

app.set("view engine", "ejs");
app.set('views', path.resolve('./views'))


app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(checkForAuthenticationCookies("token"))
app.use(express.static(path.resolve('./public')))

app.use('/user', UserRouter)
app.use('/blog', BlogRouter)

app.get('/', async (req, res) => {
    const allBlogs = await Blog.find({});
    res.render('home', {
        user: req.user,
        blogs: allBlogs
    });
})



app.listen(PORT, () => {
    console.log(`Express server is running at port${PORT}`)
})