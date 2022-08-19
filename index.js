import express from 'express'; 
import multer from 'multer';
import cors from 'cors'; 
import mongoose from 'mongoose';


import { registerValidation, loginValidation, postCreateValidation } from './validations.js'

import checkAuth from './utils/checkAuth.js'
import * as UserControllers from './UserControllers/UserController.js'
import * as PostController from './UserControllers/PostController.js'
import handleValidationErrors from './utils/handleValidationErrors.js' 

mongoose.connect('mongodb+srv://admin:wwwwww@cluster0.qzke4.mongodb.net/blog?retryWrites=true&w=majority')
.then(() => console.log('DB Ok'))
.catch((err) => console.log('err', err))


const app = express ();

app.use(cors());


////UPLOADS FILES
const storage = multer.diskStorage({
    destination: (_, __, callback) => {
        callback(null, 'uploads'); 
    }, 

    filename: (_, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        callback(null, file.fieldname + '-' + uniqueSuffix+`.png`)

    }, 
});

const upload = multer({ storage }) 
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {

    res.json({

        url: `/uploads/${req.file.filename}`, 
    });
})

app.post('/upload/avatars', upload.single('image'), (req, res) => {

    res.json({
        url: `/uploads/avatars/${req.file.filename}`, 
    });
})
app.use('/uploads/', express.static('uploads')); 
app.use('/uploads/avatars', express.static('uploads'));



app.use(express.json());


app.post('/auth/login', loginValidation, handleValidationErrors, UserControllers.login)

/////USER REGISTRATION
app.post('/auth/register',  registerValidation, handleValidationErrors, UserControllers.register); 


////CHECK INFO FOR MYSELF (USER)
app.get('/auth/me', checkAuth, UserControllers.checkLogin)


////CRUD  POSTS   - Create/Read/Update/Delete 
app.get('/tags', PostController.getLastTags)
app.get('/posts', PostController.getAll) 
app.get('posts/tags', PostController.getLastTags)  
app.get('/tag/:name', PostController.getAllPostsByTag)  
app.get('/posts/:id', PostController.getOne) 
app.post('/posts/:random/date', PostController.postAllAndSortDate)
app.post('/posts/:random/popular', PostController.postAllAndSortPopular)
app.post('/posts',checkAuth, postCreateValidation , handleValidationErrors, PostController.create) 
app.delete('/posts/:id',checkAuth, PostController.remove) 
app.patch('/posts/:id',checkAuth, postCreateValidation, handleValidationErrors, PostController.update) 

app.patch('/comment/:id',checkAuth, PostController.addComment)


/////START SERVER ON PORT
app.listen(4444, (err) => {
    if (err) {
        return console.log(err)
    }
    console.log('server ok')
})


