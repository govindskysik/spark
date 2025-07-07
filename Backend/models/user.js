const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        minLength:6,

    },
    cart:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Cart'
    }
},{timestamps:true});

userSchema.pre('save',async()=>{
    if(!this.isModified('password'))return;
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
})

userSchema.methods.comparePassword=async(password)=>{
    return await bcrypt.compare(password,this.password);
}
userSchema.methods.createjwt=async()=>{
    return JsonWebTokenError.sign(
        {userId:this._id},
        process.env.JWT_SECRET,
        {expiresIn:process.env.JWT_LIFETIME}
    )
}

module.exports=mongoose.model('User',userSchema);