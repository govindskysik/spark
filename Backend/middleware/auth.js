const jwt=require('jsonwebtoken')
const {StatusCodes}=require("http-status-codes")

const auth=async(req,res,next)=>{
    const authHeader=req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer')){
        return res.status(StatusCodes.UNAUTHORIZED).json({success:false,message:"jwt token not provided"})
    }
    
    try {
        const token=authHeader.split(" ")[1]
        const payload=jwt.verify(token,process.env.JWT_SECRET)
        // if(!payload){}
        // console.log(payload)
        req.user={userId:payload.userId};
        next();
    } catch (error) {
        console.log(`error in authentication function :- ${error.message}`)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success:false,message:"error in authentication function"})
    }
}

module.exports=auth