require('dotenv').config();
const jwt=require('jsonwebtoken');
const secret=process.env.JWT_SECRET;
function createToken(user){
    const payload={
        id:user._id,
        fullname:user.fullname,
        email:user.email,
        profileimgURL:user.profileimgURL,
        phone:user.phone
    }
    const token = jwt.sign(payload,secret);
    return token;
}

function validateToken(token){
    const payload=jwt.verify(token,secret);
    return payload;
}

module.exports={
    createToken,
    validateToken
}