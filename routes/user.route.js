require('dotenv').config();
const https = require('https');
const { Router } = require('express');
const path = require('path');
const User = require('../models/user.model');
const Blog = require('../models/blog.model');
const { createToken } = require('../Utils/authentication');
const multer = require('multer');
const checkauthenticationcookie = require('../middlewares/authentication');
const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve('./public/images'));
    },
    filename: function (req, file, cb) {
        const filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });

router.get('/signup', (req, res) => {
    res.render('Signup');
})
router.get('/signin', (req, res) => {
    res.render('Signin');
})

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    // console.log(phone);
    try {
        const user = await User.findOne({ email }); // Select the User
        if (!user || !user.checkPassword(password)) {
            res.render('Signin', {
                message: "Incorrect Password or User Does not exists !"
            })
        } else {
            // console.log(user);
            //Generate The Token
            const token = createToken(user);
            // console.log(token);
            //Save the Token to Cookies or LocalStorage 
            return res.cookie("token", token).redirect('/');
        }

    } catch (e) {
        console.log('Error while Sign In ', e);
        res.status(500).send('Internal Server Error');
    }


})

router.post('/signup', upload.single('avatar'), async (req, res) => {
    // console.log(req.body);
    const { fullname, email,password } = req.body;
    let profileimgURL;
    if (req.file) {
        profileimgURL = `images/${req.file.filename}`;
    } else {
        profileimgURL = "undefined";
    }
    res.render('Otp',{
        fullname,
        email,
        password,
        profileimgURL
    });
});

router.get('/dashboard', checkauthenticationcookie('token'), async (req, res) => {
    // console.log(req.user);
    if (typeof req.user === "undefined") {
        return res.status(404).render('404ErrorPage');
    } else {
        const blogs = await Blog.find({ author: req.user.id }).populate('author');
        // console.log(blogs);
        return res.render('Dashboard', {
            user: req.user,
            blogs: blogs
        });
    }

})
router.get('/logout', (req, res) => {
    res.clearCookie("token");
    console.log("User Logged Out !");
    return res.redirect('/');
})
module.exports = router;

router.post('/verified-user', async (req, res) => {
    const { user_json_url, fullname, email, password, profileimgURL } = req.body;

    if (!user_json_url) return res.json({ success: false });

    https.get(user_json_url, (apiRes) => {
        let data = '';

        apiRes.on('data', chunk => data += chunk);
        apiRes.on('end', async () => {
            try {
                const userData = JSON.parse(data);
                const phone = `${userData.user_country_code}${userData.user_phone_number}`;

                await User.create({
                    fullname,
                    email,
                    phone,
                    password,
                    profileimgURL
                });

                return res.json({ success: true });
            } catch (err) {
                console.error(err);
                res.json({ success: false });
            }
        });
    }).on('error', (err) => {
        console.error('HTTPS Error:', err.message);
        res.status(500).json({ success: false });
    });
});