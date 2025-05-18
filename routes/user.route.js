const {Router}=require('express');
const path=require('path');
const User=require('../models/user.model');
const { createToken } = require('../Utils/authentication');
const multer  = require('multer');
const router=Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve('./public/images'));
  },
  filename: function (req, file, cb) {
   const filename=`${Date.now()}-${file.originalname}`;
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

router.get('/signup',(req,res)=>{
    res.render('Signup');
})
router.get('/signin',(req,res)=>{
    res.render('Signin');
})

router.post('/signin',async(req,res)=>{
    const {email,password}=req.body;
    try{
        const user=await User.findOne({email}); // Select the User
        if(!user||!user.checkPassword(password)){
            res.render('Signin',{
                message:"Incorrect Password or User Does not exists !"
            })
        }else{
            // console.log(user);
            //Generate The Token
            const token =createToken(user);
            // console.log(token);
            //Save the Token to Cookies or LocalStorage 
            return res.cookie("token",token).redirect('/');
        }
        
    }catch(e){
        console.log('Error while Sign In ',e);
        res.status(500).send('Internal Server Error');
    }
    

})

router.post('/signup',upload.single('avatar') ,async (req,res)=>{
    console.log(req.body);
    const {fullname,email,password}=req.body;
    let profileimgURL;
    if(req.file){
       profileimgURL= `images/${req.file.filename}`;
    }else{
        profileimgURL="undefined";
    }
    await User.create({
        fullname,
        email,
        password,
        profileimgURL:profileimgURL
    });
    res.redirect('/');
})

router.get('/logout',(req,res)=>{
    res.clearCookie("token");
    console.log("User Logged Out !");
    return res.redirect('/');
})
module.exports=router;