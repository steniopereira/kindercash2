var authController = require('../controllers/authcontroller.js');

module.exports = function(app,passport){

app.get('/', authController.identify);


app.get('/signup', authController.signup);


app.get('/signupERROR', authController.signup);


app.get('/signin', authController.signin);


app.get('/signinERROR', authController.signin);

app.get('/views_account_summary', authController.views_account_summary);


app.post('/signup', passport.authenticate('local-signup',  { successRedirect: '/dashboard', failureRedirect: '/signupERROR'}));


app.get('/dashboard',isLoggedIn, authController.dashboard);


app.get('/signout',authController.logout);


app.post('/signin', passport.authenticate('local-signin',  { successRedirect: '/dashboard', failureRedirect: '/signinERROR'}));


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/signinERROR');
}


}