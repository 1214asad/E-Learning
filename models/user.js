const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");


const userSchema = new mongoose.Schema({
    userRole:{
        type: String,
        required:true
    },
    name :{
        type: String,
        required : [true, "Please enter an name!"],
        maxLength: [16, "maximum length is six"]

    },
    email :{
        type: String,
        required : [true, "Please enter an email!"],
        lowercase: true,
        unique: true,
        validate: [isEmail, "Please enter a valid email.."]
    },
    password :{
        type: String,
        required : [true, "Please enter a password"],
        minLength: [6, "minimum length is six"]

    }
})


// fired a function before doc saved to db 
userSchema.pre('save', async function(next){
    // adding the salt 
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt)
    next();
})

userSchema.statics.login = async function(email, password){
    const user = await this.findOne({ email: email })
    if(user){
      const auth = await bcrypt.compare(password, user.password);
      if(auth){
        return user
      }
      throw Error("Incorrect password.");
    }
    throw Error("Incorrect email Id.")
}

const User = mongoose.model('user', userSchema);
module.exports = User;