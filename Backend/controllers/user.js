const zod=require('zod');
const {StatusCodes}=require('http-status-codes')
const {User}=require('../models/user');

const userSchema=zod.object({
    email:zod.string().email(),
    password:zod.string().min(6)
})
const signin=async(req,res)=>{
    try {
        const isValid=userSchema.safeParse(req.body);
        if(!isValid.success)
            return res.status(StatusCodes.BAD_REQUEST).json({msg:"invalid input data"})
        const user=await User.findOne({email:req.body.email});
        if(!user){
            return res.status(StatusCodes.UNAUTHORIZED).json({msg:"invalid credentials"})
        }
        if(!user.comparePassword(req.body.password)){
            return res.status(StatusCodes.UNAUTHORIZED).json({msg:"invalid credentials"})
        }
        const token=await user.createjwt();
        return res.status(StatusCodes.OK).json({user:{email:user.email},token});
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:"internal server error",error:error.message});
    }
}

const signup=async(req,res)=>{
    try {
        const isValid=userSchema.safeParse(req.body);
        if(!isValid.success){
            return res.status(StatusCodes.BAD_REQUEST).json({msg:"invalid input data"});
        }
        const existingUser=await User.findOne({email:req.body.email});
        if(existingUser){
            return res.status(StatusCodes.BAD_REQUEST).json({msg:"user already exists"});
        }
        const user=await User.create(req.body);
        const token=await user.createjwt();
        return res.status(StatusCodes.CREATED).json({user:{email:user.email},token});
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:"internal server error",error:error.message});
    }
}

module.exports={signin,signup};