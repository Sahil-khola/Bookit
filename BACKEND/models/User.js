import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
name:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true,
    unique:true
},
password:{
    type:String,
    required:true
},
role:{
    type:String,
    enum:["admin","user"],
    default:"user"
},
isVerified:{
    type:Boolean,
    default:false
},
whislist:{
    type:[mongoose.Schema.Types.ObjectId],
    ref:"Event"
}
})

const User = mongoose.model("User", UserSchema);
export default User