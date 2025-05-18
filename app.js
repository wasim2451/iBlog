require('dotenv').config();
const express=require('express');
const path=require('path');
const mongoose=require('mongoose');
const userRouter=require('./routes/user.route');
const blogRouter=require('./routes/blog.route');
const blogviewRouter=require('./routes/blog.route');
const cookieParser = require('cookie-parser');
const checkauthenticationcookie=require('./middlewares/authentication');
const Blog = require('./models/blog.model');
const app=express();
const PORT=process.env.PORT||3000;

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.resolve('./public')));


mongoose.connect(process.env.MONGODB_URI || process.env.MONGODB_URL)
  .then(() => {
    console.log('Connected to DB');
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.set('view engine','ejs');
app.set('views',path.resolve('./views'));

app.use(cookieParser());
app.use('/user',userRouter);
app.use('/blog',checkauthenticationcookie('token'),blogRouter);
app.use('/blog/view',blogviewRouter);
app.get('/',checkauthenticationcookie('token'),async(req,res)=>{
    const blogs=await Blog.find({}).populate('author');
    res.render('Home',{
        user:req.user,
        blogs:blogs
    });
});


app.listen(PORT,()=>{
    console.log(`Server is listening on ${PORT}`);
});