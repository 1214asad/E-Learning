const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();


const reqAuth =(req,res,next)=>{
  const token = req.cookies.jwt;

  if(token){
    jwt.verify(token, "your secrete is my secrete", (err, decodeToken)=>{
        if(err){
            console.log(err.message);
            res.redirect("/login");
        }
        else{
            next();
        }
    })
  }
  else{
    res.redirect("/login");
  }
}

// check for user continously on evry get request 
const checkUser = (req,res,next)=>{
  const token = req.cookies.jwt;
  if(token){
    jwt.verify(token, "your secrete is my secrete", async (err, decodeToken)=>{
    if(err){
      console.log(err.message);
      res.locals.user = null;
      next();
    }
    else{
         console.log(decodeToken);
         const user = await User.findById(decodeToken.id);
         res.locals.user = user;
         next();

    }
    })
  }
  else{
    res.locals.user = null;
    next();
    res.redirect('/login');
  }

}

module.exports = { reqAuth, checkUser };