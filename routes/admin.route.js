require('dotenv').config();
const {Router}=require('express');
const User = require('../models/user.model');
const Blog = require('../models/blog.model');
const router=Router();
router.get('/',async(req,res)=>{
    res.render('LockedPage');
})

router.post('/showAdminPanel',async(req,res)=>{
    const{admin_pass}=req.body;
    if(admin_pass===process.env.ADMIN_PASS){
        const users=await User.find({});
        const blogs=await Blog.find({}).populate('author');
        res.render('AdminPanel',{
            users:users,
            blogs:blogs
        });
    }else{
        return res.send(`
    <div style="
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
        background-color: #f4f4f9;
        font-family: Arial, sans-serif;
    ">
        <h1 style="
            text-align: center;
            color:rgb(158, 5, 5);
            font-size: 3em;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
            padding: 20px;
        ">
            YOU ARE NOT ADMIN. GO BACK SIMON! 😂😂😂
        </h1>
    </div>
`);
    }
});

router.post('/deleteuser/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Blog.deleteMany({ author: id });
        await User.findByIdAndDelete(id);
        const users = await User.find({});
        const blogs = await Blog.find({}).populate({
        path: 'author',
        match: {}, // ensures only blogs with author data are populated
        });
        res.render('AdminPanel', {
            users: users,
            blogs: blogs
        });
    } catch (error) {
        console.error("Error deleting user and blogs:", error);
        res.status(500).send("An error occurred while deleting the user and their blogs.");
    }
});

router.post('/deleteblog/:id',async (req,res)=>{
    const {id}=req.params;
    await Blog.findByIdAndDelete(id);
    const blogs=await Blog.find({}).populate({
        path: 'author',
        match: {}, // ensures only blogs with author data are populated
    });
    const users=await User.find({});
    res.render('AdminPanel', {
            users: users,
            blogs: blogs
        });
})

module.exports=router;