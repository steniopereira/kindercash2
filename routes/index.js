var dataController = require('./users.js');

module.exports = function (app,passport) {


    app.get('/',dataController.showHome);
    app.get('/identify',dataController.Identify);
    app.get('/login',dataController.showLogin);
    app.get('/signup',dataController.showSignup);


    // process the login form
    app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }),
        function(req, res) {
            console.log("hello");

            res.redirect('/');
    });

    app.post('/signup',passport.authenticate('local-signup', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/admin/addsavings',dataController.showAddSavingsAdmin);
    app.post('/admin/addsavings',dataController.postAddSavingsAdmin);

    app.get('/mysavings',isLoggedIn,dataController.showMySavings);
    app.post('/mysavings',isLoggedIn,dataController.addMySavings);

    app.get('/mysavings/delete/:bid',isLoggedIn,dataController.deleteMySavings);

    app.post('/user/process/withdraw',isLoggedIn,dataController.processWithdraw);
    app.post('/user/process/deposit',isLoggedIn,dataController.processDeposit);

    app.post('/user/process/checkingAdd',isLoggedIn,dataController.processCheckingAdd);
    app.post('/user/process/checkingSpent',isLoggedIn,dataController.processCheckingSpent);


    app.get('/profile',isLoggedIn,dataController.showMyProfile);
    app.post('/profile', isLoggedIn, dataController.processChangePass);

    app.get('/checking/stats',isLoggedIn,dataController.showSearchChecking);
    app.post('/checking/stats',isLoggedIn,dataController.processSearchChecking);


    app.get('/savings/stats',isLoggedIn,dataController.showSavingsStats);
    app.post('/savings/stats',isLoggedIn,dataController.processSavingsStats);

};


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}