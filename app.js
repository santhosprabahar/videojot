const express = require('express')
const app = express();
const path = require('path');
const port = process.env.PORT || 4200;
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override')
const mongoose = require('mongoose');
const passport = require('passport');
const favicon = require('serve-favicon');



mongoose.Promise = global.Promise //to get rid of deprecated warnings

const db = require('./config/db');
mongoose.connect('mongodb://santhosprabahar:sandyprabuq123@ds237967.mlab.com:37967/node_demo').then(()=>{
    console.log('MongoDB connected');
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname + '/public/images/favicon.ico')));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(methodOverride('_method'));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));


app.use(passport.initialize());
app.use(passport.session());

app.use(flash());


app.use(function(req,res,next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user  = req.user
    next();
});


require('./models/Ideas.js');
require('./models/Users.js');

require('./config/passport.js')(passport);

const Ideas_route = require('./routes/ideas.js');
const Users_route = require('./routes/users.js');


app.get('/', (req, res) => {
    res.render('index');
});



// express handlebars middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use('/ideas', Ideas_route);
app.use('/idea', Ideas_route);
app.use('/users', Users_route);

app.get('*', function (req, res) {
    res.render('no_route');
});

app.use(function (err, req, res, next) {
    console.log(err.stack);
    res.status(404).send('Something broke!')
    next();
});

app.listen(port, ()=>{
    console.log(`server started on port ${port}`)
})