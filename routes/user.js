const { Router } = require("express");
const { User } = require("../models/user");
const { getSignin, getSignUp, postSignin, postSignup, postLogout } = require("../controllers/user");



const router = Router()


router.get('/signin', getSignin)
router.get('/signup', getSignUp)

router.post('/signin', postSignin)

router.post('/signup', postSignup)

router.get('/logout', postLogout)

module.exports = router