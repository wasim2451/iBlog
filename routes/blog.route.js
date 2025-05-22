const {Router}=require('express');
const multer  = require('multer')
const path=require('path');
const Blog=require('../models/blog.model');
const Comments=require('../models/comment.model');
const mongoose=require('mongoose');
const storage = multer.diskStorage({
        filename: function (req, file, cb) {
        const filename=`${Date.now()}-${file.originalname}`;
        cb(null, filename);
    },
        destination: function (req, file, cb) {
        cb(null,path.resolve(`./public/uploads`));
    },
});
  
const upload = multer({ storage: storage })

const router=Router();
router.get('/createBlog',(req,res)=>{
    if(typeof req.user==='undefined'){
        return res.render('404ErrorPage.ejs');
    }
    else{
        return res.render('Blog',{
        user:req.user
        });
    }
});
router.post('/create',upload.single('coverImage'),async (req,res)=>{
    // console.log(req.body);
    // console.log(req.token);
    // console.log(req.file);
    if(typeof req.user==='undefined'){
        return res.status(404).render('404ErrorPage.ejs');
    }
    const {title,content}=req.body;
    await Blog.create({
        title,
        content,
        author:req.user.id,
        coverURL:`uploads/${req.file.filename}`
    });
    // console.log(blog);
    return res.redirect('/');
});


router.get('/user/deleteblog/:id',async(req,res)=>{
    if(typeof req.user==='undefined'){
        return res.status(404).render('404ErrorPage.ejs');
    }
    const {id}=req.params;
    await Blog.findByIdAndDelete(id);
    // console.log('Delete Fn');
    // console.log(blogs);
    return res.redirect('/');
});

router.get('/user/editblog/:id',async (req,res)=>{
    if (typeof req.user === 'undefined') {
        return res.status(404).render('404ErrorPage.ejs');
    } else {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send("Invalid Blog ID");
        }
        const blog = await Blog.findById(id);
        // console.log(blog);
        if (!blog) {
            return res.status(404).send('Blog not found');
        }
        return res.render('Edit', {
            user: req.user,
            blog: blog
        });
    }
    
});

router.post('/user/editblog/:id',upload.single('cover'),async (req,res)=>{
    if (typeof req.user === 'undefined') {
        return res.status(404).render('404ErrorPage.ejs');
    }
    const {title,content}=req.body;
    const {id}=req.params;
    const blog=await Blog.findById(id);
    blog.title=title;
    blog.content=content;
    if(req.file){
        blog.coverURL=`uploads/${req.file.filename}`;
    }
    await blog.save();
    return res.redirect('/');
});

router.post('/comment/:blogid',async(req,res)=>{
    if(typeof req.user==='undefined'){
        return res.status(404).render('404ErrorPage.ejs');
    }
    const userId=req.user.id;
    const{blogid}=req.params;
    const{content}=req.body;
    await Comments.create({
        content,
        blogId:blogid,
        author:userId,
    });
    return res.redirect(`/blog/showblog/${blogid}`);

})

router.get('/comment/delete/:blogId/:comId',async(req,res)=>{
     if(typeof req.user==='undefined'){
        return res.status(404).render('404ErrorPage.ejs');
    }
    const{blogId,comId}=req.params;
    const comment = await Comments.findById(comId).populate('author');
    const blog = await Blog.findById(blogId).populate('author');
    if(!comment||!blog){
        return res.status(404).render('404ErrorPage.ejs');
    }
    await Comments.findByIdAndDelete(comId);
    return res.redirect(`/blog/showblog/${blogId}`);
    
})

router.get('/showblog/:id',async(req,res)=>{
    const {id}=req.params; // blogId
    // console.log(req.params);
     if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).render('404ErrorPage'); // or next() if you have a 404 handler
    }

    const blog=await Blog.findById(id).populate('author');
    const comments=await Comments.find({blogId:id}).populate('author');
    // console.log(comments);
    if(!blog) {
        return res.status(404).render('404ErrorPage'); // or next() if you have a 404 handler
    }
    // console.log(req.user.profileimgURL);
    return res.render('BlogDisplay',{
        user:req.user,
        blog:blog,
        comments:comments
    })
});
module.exports=router;