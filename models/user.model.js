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
    phone: {
    type: String,
    required: true,
    match: /^(\+91|91)?[6-9]\d{9}$/,
    trim: true
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
    if (!this.phone.startsWith('+91')) {
    this.phone = '+91' + this.phone.replace(/^(\+91|91)?/, '');
    }
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