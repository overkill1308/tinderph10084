const express = require('express')
const userModel = require('../models/user')
const path = require('path')
const app = express()
app.set('views', path.join(__dirname, '../resource/views'))

const multer  = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './src/public/upload')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()  + "-" + file.originalname)
    }
});  
const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        console.log(file);
        if(file.mimetype=="image/jpg" || file.mimetype=="image/png" || file.mimetype=="image/jpeg"){
            cb(null, true)
        }else{
            return cb(new Error('Only image are allowed!'))
        }
    }
}).single("avatar");


app.get('/', (req, res) => {
    res.render('home')
})

app.get('/create', (req, res) => {
    res.render('users/addOrEdit.hbs', {
        viewTitle: 'ADD USER'
    })
})

app.post('/add', async (req, res) => {

    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            res.json({'kq':0, 'error':"A Multer error occurred when uploading."})
        } else if (err) {
            res.json({'kq':0, 'error':"An unknown error occurred when uploading." + err})
        }else{
            console.log(req.body)
            if(req.body.id == ''){
                //add user
                addRecord(req, res)
            } else{
                //update user
                updateRecord(req, res)
            }
        }

    });
})

function addRecord(req, res){
    const u = new userModel({
        avatar: req.file.filename,
        fullname: req.body.fullname,
        date: req.body.date,
        gender: req.body.gender,
        hobbies: req.body.hobbies,
        phone: req.body.phone,
        password: req.body.password,
        description: req.body.description,
    })
    try {
        u.save()
        // res.send(u)
        res.render('users/addOrEdit.hbs', {
            viewTitle: 'INSERT USER COMPLETED'
        })
    } catch (error){
        res.status(500).send(error)
    }
}

function updateRecord(req, res){
    userModel.findOneAndUpdate({_id:req.body.id}, req.body, {new:true}, (err, doc) => {
        if(!err){
            res.redirect('/users/listuser')
        } else {
            console.log(err)
            res.render('users/addOrEdit.hbs', {
                viewTitle: 'UPDATE FALSE'
            })
        }
    })
}

app.get('/listuser', (req, res) => {
    userModel.find({}).then(users => {
        res.render('users/listuser.hbs', {
            viewTitle: 'LIST USERS',
            users: users.map(user => user.toJSON())
        })
    })
})

app.get('/edit/:id', (req, res) => {
    userModel.findById(req.params.id, (err, user) => {
        if(!err) {
            res.render('users/addOrEdit.hbs', {
                viewTitle: 'EDIT USER',
                user: user.toJSON()
            })
        }
    })
})

app.get('/detail/:id', (req, res) => {
    userModel.findById(req.params.id, (err, user) => {
        if(!err) {
            res.render('users/details.hbs', {
                viewTitle: 'USER PROFILE',
                user: user.toJSON()
            })
        }
    })
})

app.get('/delete/:id', async(req, res) => {
    try{
        const user = await userModel.findByIdAndDelete(req.params.id, req.body)
        if(!user) {
            res.status(404).send('No item found')
            res.status(500).send()
        } else {
            res.redirect('/listuser')
        }
    } catch (error){
        res.status(500).send(error)
    }
})

module.exports = app