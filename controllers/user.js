const getSignin = (req, res) => {
    return res.render('signin')
}


const getSignUp = (req, res) => {
    return res.render('signup')
}


const postSignin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const token = await User.matchPasswordAndGenerateToken(email, password);
        res.cookie("token", token).redirect('/')
    } catch (error) {
        console.log(error)
        res.render('signin', {
            error: " invalid email or password"
        })
    }


}



const postSignup = async (req, res) => {
    const { fullName, email, password } = req.body

    await User.create({
        fullName,
        email,
        password,
    })

    return res.redirect('/')
}


const postLogout = (req, res) => {
    res.clearCookie("token").redirect('/')
}

module.exports = {
    getSignin,
    getSignUp,
    postSignin,
    postSignup,
    postLogout
}