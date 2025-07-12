const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken')
const Counter=require('./counter')

const userSchema=new mongoose.Schema({
    _id:{
        type:Number,  
    },
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

userSchema.pre('save',async function(next){
    if(this.isNew){
        const count=await Counter.findByIdAndUpdate(
            {_id:'user'},
            {$inc:{seq:1}},
            {new:true,upsert:true}
        )
        this._id=count.seq
    }
    next()
})
userSchema.pre('save',async function(){
    if(!this.isModified('password'))return;
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
})
userSchema.methods.comparePassword=async function(password){
    return await bcrypt.compare(password,this.password);
}
userSchema.methods.createjwt= function(){
    return jwt.sign(
        {userId:this._id},
        process.env.JWT_SECRET,
        {expiresIn:process.env.JWT_LIFETIME}
    )
}

module.exports=mongoose.model('User',userSchema);