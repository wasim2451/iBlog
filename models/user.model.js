const {Schema,model}=require('mongoose');
const { createHmac, randomBytes } = require('node:crypto');
const userSchema=new Schema({
    fullname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    salt:{
        type:String,
    },
    password:{
        type:String,
        required:true
    },
    profileimgURL:{
        type:String,
    },
    role:{
       type:String,
       enum:["USER","ADMIN"],
       default:"USER"
    }
},
{timestamps:true}
);

userSchema.pre('save',function(next){
    const user=this;

    if(!user.isModified('password')){
        return next();
    }
    const salt=randomBytes(16).toString();
    const hashPassword=createHmac('sha256',salt)
    .update(user.password)
    .digest('hex');
    user.password=hashPassword;
    user.salt=salt;
    next();

})

userSchema.methods.checkPassword = function (password) {
    const salt = this.salt;
    const hashed = createHmac('sha256', salt)
        .update(password)
        .digest('hex');
    return hashed === this.password;
};



const User=model('user',userSchema);
module.exports=User;