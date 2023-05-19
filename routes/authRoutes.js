const { Router} = require("express");
const authController = require("../controller/authController");
const routers = Router();

routers.get('/signup', authController.signup_get);
routers.post('/signup', authController.signup_post);
routers.get('/login', authController.login_get);
routers.post('/login', authController.login_post);
routers.get('/logout', authController.logout_get);
routers.get('/create', authController.create_get);
routers.get('/blogs', authController.blog_get);
routers.post('/blogs', authController.blog_post);
routers.get('/blogs/:id', authController.blogById_get);
routers.delete('/blogs/:id',authController.blogById_delete);
routers.put('/blogs/:id',authController.blogById_put);
routers.get('/contact', authController.contact_get);
routers.get('/about', authController.about_get);
routers.get('/couses', authController.courses_get);


module.exports = routers;
