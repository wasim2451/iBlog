const {Schema,model}=require('mongoose');
const commentSchema=new Schema({
    content:{
        type:String,
        required:true
    },
    blogId:{
        type:Schema.Types.ObjectId,
        ref:"blog",
        required:true
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true
    }

},{timestamps:true});
const Comments=model('comments',commentSchema);
module.exports=Comments;