const { validateToken } = require("../Utils/authentication");

function checkauthenticationcookie(cookieName){
    return (req,res,next)=>{
        const token=req.cookies[cookieName];
        if(!token||token==='undefined'){
            req.user=undefined;
            return next();
        }else{
            try{
                const payload=validateToken(token);
                req.user=payload;
                return next();
            }catch(e){
                console.log(e.message);
                return res.status(500).send('Authentication Failed !')
            }
        }
    }
}
module.exports=checkauthenticationcookie;