const {Schema,model}=require('mongoose');
const blogSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    coverURL:{
        type:String,
        required:false
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true
    }

},{timestamps:true});
const Blog=model('blog',blogSchema)
module.exports=Blog