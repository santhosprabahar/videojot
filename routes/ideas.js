const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Ideas = mongoose.model('Idea');

const {ensureAuthenticated} = require('../helpers/auth.js');



router.get('/', ensureAuthenticated,(req, res) => {
    Ideas.find({user_id: req.user.id})
        .sort({ Date: 'desc' })
        .then(ideas => {
            res.render('ideas/ideas', {
                data: ideas
            });
        });

})

router.get('/add', ensureAuthenticated,(req, res) => {
    res.render('ideas/add');
});

router.get('/edit/:id', ensureAuthenticated,(req, res) => {
    id = req.params.id
    Ideas.findOne({
        _id: id
    }).then(editData => {
        if(editData.user_id != req.user.id){
            req.flash('error_msg', 'Not Authorized');
            res.redirect('/ideas');
        }
        else{
            res.render('ideas/edit', {
                data: editData
            });
        }
        
    });
});

router.put('/edit/:id', ensureAuthenticated,(req, res) => {
    id = req.params.id
    Ideas.findOne({
        _id: id
    }).then(editData => {
        editData.title = req.body.title;
        editData.details = req.body.details;
        editData.save()
            .then(savedData => {
                res.redirect('/ideas');
            });
    });
});

router.delete('/delete/:id', ensureAuthenticated,(req, res) => {
    id = req.params.id
    Ideas.remove({
        _id: id
    }).then(() => {
        req.flash('success_msg', "Idea Deleted Successfully")
        res.redirect('/ideas');
    });
});

router.post('/add', ensureAuthenticated,(req, res) => {
    let data = req.body
    let errors = []
    if (!data.title) {
        errors.push({ message: 'Please enter a title' });
    }
    if (!data.details) {
        errors.push({ message: 'please add some details' });
    }
    if (errors.length > 0) {
        res.render('ideas/add', { error_list: errors });
    }
    else {
        const newData = {
            title: data.title,
            details: data.details,
            user_id: req.user.id
        }
        new Ideas(newData).save()
            .then(savedData => {
                res.redirect('/ideas')
            });
    }
});

router.get('/:title/Addsubmenu', ensureAuthenticated,(req,res)=>{
    let title = req.params.title
    res.render('ideas/Addsubmenu', {title: title});
})

router.post('/:title/Addsubmenu', ensureAuthenticated,(req,res)=>{
    let title = req.params.title;
    let submenu = req.body.submenu;
    let errors = []
    if (!submenu) {
        errors.push({ message: 'Please enter a title' });
    }
    if (errors.length > 0) {
        res.render('ideas/add', { error_list: errors });
    }
    Ideas.update({user_id: req.user.id},{
        $push: {submenu : submenu}
    }).then(idea => {
        
    });
    res.redirect(`/ideas/${title}/submenu`)
    // Ideas.find({user_id: req.user.id})
    //     .then(Idea =>{
    //         Idea.update(
    //             {$push:{submenu:title}}
    //         );
    //         Idea.save().then((idea)=> console.log(idea));
    //         req.flash('success_msg', "Submenu added successfully");
    //         res.redirect(`/${title}/submenu`);
    //     });
});

router.get('/:title/submenu', ensureAuthenticated,(req,res)=>{
    Ideas.findOne({
        user_id: req.user.id
    }).then(Idea =>{
        console.log(typeof(Idea.submenu));
        res.render('ideas/submenu',{
            submenus: Idea.submenu
        });
    });
    
  
});

module.exports = router