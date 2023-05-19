const User = require("../models/user");
const Blog = require("../models/blog");
const app = require('express')
const jsonwebtoken = require("jsonwebtoken");
const validTime = 3*24*60*60*1000;
const { AsyncLocalStorage} = require('async_hooks');
require("dotenv").config();

// ceating a token 
const createToken = (id)=>{
   return jsonwebtoken.sign({id}, "your secrete is my secrete", {
    expiresIn:validTime
   });}

   
// error handler function 
const errorHandler = (err)=>{
    console.log(err.message, err.code);
    const errors = {email:'', password:''}

// incorrect email id
if(err.message === "Incorrect email Id.") {
      errors.email = "Please type correct email id";
}
// incorect password 
if(err.message === "Incorrect password.") {
    errors.password = "Please type correct password";
}

// email duplication
    if(err.code === 11000){
        errors.email = "This Email is already registered!";
    }
// email validation     
console.log(err);
    if(err.message.includes("user validation failed")){
      Object.values(err.errors).forEach(({properties}) =>{
         errors[properties.path] = properties.message;
      })
    }
    return errors;
}

module.exports.signup_get = (req,res)=>{
    res.render('signup');
}

module.exports.login_get = (req,res)=>{
    res.render('login');
}

// signup 
module.exports.signup_post = async (req,res)=>{
    const { userRole, name, email, password } = req.body;
    try{
        const user = await User.create({ userRole: userRole, name: name, email:email, password:password })
        console.log("here everythin okk")
        const token = createToken(user._id);
        res.cookie("jwt", token, {httpOnly: true, maxAge: validTime});
        res.status(201).json({user: user._id});
    }
    catch(err){
       const errors = errorHandler(err);
        res.status(400).json({errors});
    }
    
}

module.exports.login_post = async (req,res)=>{
    const { email, password } = req.body;
    
    try{
        const user = await User.login(email, password); 
        const token = createToken(user._id);
        res.cookie("jwt", token, {httpOnly: true, maxAge: validTime}); 
        res.status(201).json({user: user._id}) 
    }
    catch(err){
        const errors = errorHandler(err)
        res.status(400).json({errors})
    }
}

module.exports.logout_get = (req,res)=>{
    res.cookie("jwt", "", { maxAge:2 });
    res.redirect("/");
}

module.exports.create_get = (req,res)=>{
res.render('create')
}

module.exports.blog_post = async (req,res)=>{
        const {userId, tittle, snippet, body} = req.body;
        try{
            const user = await Blog.create({userId, tittle, snippet, body})
            res.status(201).json({blog:user._id})
           
        }
        catch{(err)=>console.log(err)
        }
        
}
module.exports.blog_get = (req,res)=>{
    console.log(Blog);
    Blog.find().sort({createdAt : -1})
    .then((result)=>{
        res.render("blogs", {title : "All blogs", blogs: result});
    })
    .catch((err)=>{
        console.log(err)
        console.log("..hiii..error occurs.")
    })
}

module.exports.blogById_get = (req,res)=>{
        const id = req.params.id.trim();
        // problem occurs here ..
        Blog.findById(id)
        .then((result)=>{
            res.render('detail',{blog : result, title : "Blog details"})
        })
        .catch((err)=>{
            console.log(err)
        })
    }

module.exports.blogById_delete = (req,res) =>{
    const id = req.params.id.trim();
    Blog.findByIdAndDelete(id)
    .then(result=>
     {res.json({redirect : "/blogs"})})
    .catch((err)=>console.log(err))
}  

// patch request 
module.exports.blogById_put = (req,res,next)=>{
    const id = req.params.id.trim();
    res.redirect('/create');
    const updates = req.body
    Blog.findOneAndUpdate({_id: id}, {$set:updates})
        .then((result)=> {
            res.status(200).json(result)
        })
        .catch((err)=>{
            res.status(500).json({error :'could not delete document.'})
        })
        next();
    }
    



module.exports.contact_get = (req,res)=>{
    res.render('contact');
}


module.exports.about_get = (req,res)=>{
    res.render('about');
}

module.exports.courses_get = (req,res)=>{
    res.render('courses');
}