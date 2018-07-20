var express = require('express');
var gravatar = require('gravatar');
var router = express.Router();
var db = require('./db.js');
var bcrypt = require('bcrypt-nodejs');

router.showHome = function(req, res){
    getSavings(function(res){
        SavingsList = res;
    });
    res.render('index', { title: 'Welcome to KinderCash',pageTitle:'Home',message:req.flash('message')});
};

router.Identify = function(req,res){
    res.render('identify');
};

router.showLogin = function (req, res) {
    res.render('login',{pageTitle:'KinderCash Login',currentUser: req.user, message: req.flash('loginMessage')});
};

router.showSignup = function (req, res) {
    res.render('signup',{pageTitle:'KinderCash Sign Up',currentUser: req.user, message: req.flash('signupMessage')});
};

var SavingsList = [];

function getSavings(cb) {
    db.query('SELECT * From savings', function (error, results, fields) {
        if (error) throw error;
        cb(results);
    });
}

router.showAddSavingsAdmin = function (req, res) {
    getSavings(function(res){
        SavingsList = res;
    });
    res.render('addSavings',{pageTitle: 'Admin | Add Account or Savings Goal', data: SavingsList});
};


router.postAddSavingsAdmin = function (req, res) {
    var savingsName = req.body.bname;
    var data = {
        savingsname    : savingsName
    };
    var query = db.query("INSERT INTO savings set ? ",data, function(err, rows)
    {
        if (err)
            console.log("Error inserting : %s ",err );
    });
    res.render('addSavings',{message:'Data Added Successfully!'});
};

router.showMySavings = function (req, res) {
    var uid = req.user.uid;
    db.query('select * from savings where id not in (select bid from mysavings where uid = ?); select my.bid,my.currentbalance,b.savingsname from mysavings my join savings b on b.id = my.bid where my.uid = ?',[uid,uid], function (error, results, fields) {
        if (error) throw error;
        res.render('addMySavings',{pageTitle: 'My Accounts and Savings Goals', savings: results[0],mySavings:results[1],message: req.flash('message')});
    });
};


router.addMySavings = function (req, res) {
    var uid = req.user.uid;
    var amount = req.body.balance;
    var bid = req.body.savings;

    db.query('INSERT INTO mysavings values (?,?,?);',[uid,bid,amount], function (error, results, fields) {
        if (error) throw error;//res.render('addMySavings',{pageTitle: 'My Savings',message:error});
        req.flash('message', 'Your Goal or Account was Added Successfully!');
        res.redirect('/mysavings');
    });
};

router.deleteMySavings = function (req, res) {
    var uid = req.user.uid;
    var bid = req.params.bid;
    db.query('delete from mysavings where uid = ? and bid = ?;',[uid,bid], function (error, results, fields) {
        if (error) throw error;//es.render('addMySavings',{pageTitle: 'My Savings',message:error});
        req.flash('message', 'Your Goal or Account was Deleted Successfully!');
        res.redirect('/mysavings');
    });
};

router.processDeposit = function (req, res) {
    var uid = req.user.uid;
    var bid = req.body.bid;
    var amount = req.body.amount;
    var description = req.body.desc;
    var date = req.body.date;

    db.query('insert into deposit values (?,?,?,?,?); update mysavings set currentbalance = currentbalance + ? where uid = ? and bid = ?;',[uid,bid,amount,description,date,parseInt(amount),uid,bid], function (error, results, fields) {
        if (error) throw error;//es.render('addMySavings',{pageTitle: 'My Savings',message:error});
        req.flash('message', 'The amount was Deposited Successfully!');
        res.redirect('/mysavings');
    });
};


router.processWithdraw = function (req, res) {
    var uid = req.user.uid;
    var bid = req.body.bid;
    var amount = req.body.amount;
    var description = req.body.desc;
    var date = req.body.date;
    var checking = req.body.wall;


    db.query('select currentbalance from mysavings where uid = ? and bid = ?',[uid,bid], function (error, results, fields) {
        if (error) throw error;//es.render('addMySavings',{pageTitle: 'My Savings',message:error});
        //console.log('data' + results[0].currentbalance);
        var currentBalance = results[0].currentbalance - parseInt(amount);
        if(currentBalance >= 0){
            if(checking){
                db.query('insert into checking_add values (?,?,?,?);insert into withdraw values (?,?,?,?,?,?); update mysavings set currentbalance = currentbalance - ? where uid = ? and bid = ?; update users set checking = checking + ? where uid = ?',[uid,amount,description + ' #FromSavings',date,uid,bid,amount,description,1,date,parseInt(amount),uid,bid,parseInt(amount),uid],function (err, resultss) {
                    if(err) throw err;
                    req.flash('message','The amount was Withdrawn and added to your Checking Successfully!');
                    res.redirect('/mysavings');
                });
            }
            else{
                db.query('insert into withdraw values (?,?,?,?,?,?); update mysavings set currentbalance = currentbalance - ? where uid = ? and bid = ?;',[uid,bid,amount,description,0,date,parseInt(amount),uid,bid],function (err, resultss) {
                    if(err) throw err;
                    req.flash('message','The amount was Withdrawn Successfully!');
                    res.redirect('/mysavings');
                });
            }
        }
        else{
            req.flash('message', 'Insufficient amount! Withdrawal Failed.');
            res.redirect('/mysavings');
        }
    });

};

router.processCheckingAdd = function (req, res) {
    var uid = req.user.uid;
    var amount = req.body.amount;
    var description = req.body.desc;
    var date = req.body.date;

    db.query('insert into checking_add values (?,?,?,?); update users set checking = checking + ? where uid = ?;',[uid,amount,description,date,parseInt(amount),uid], function (error, results, fields) {
        if (error) throw error;
        req.flash('message', 'The amount was added to the Checking Successfully!');
        res.redirect('back');
    });
};


router.processCheckingSpent = function (req, res) {
    var uid = req.user.uid;
    var amount = req.body.amount;
    var description = req.body.desc;
    var date = req.body.date;


    db.query('select checking from users where uid = ?',[uid], function (error, results, fields) {
        if (error) throw error;//es.render('addMySavings',{pageTitle: 'My Savings',message:error});
        //console.log('data' + results[0].currentbalance);
        var currentBalance = results[0].checking - parseInt(amount);
        if(currentBalance >= 0){
            db.query('insert into checking_spent values (?,?,?,?); update users set checking = checking - ? where uid = ?;',[uid,amount,description,date,parseInt(amount),uid],function (err, resultss) {
                if(err) throw err;
                req.flash('message','The amount was deducted Successfully!');
                res.redirect('back');
            });
        }
        else{
            req.flash('message', 'Insufficient amount! You are ' + (currentBalance*-1).toString() + ' Dollars short.');
            res.redirect('back');
        }
    });

};


router.showMyProfile = function (req, res) {
    var unsecureUrl = gravatar.url(req.user.email, {s: '100', r: 'x', d: 'retro'}, false);
    res.render('myProfile',{message: req.flash('message'),pageTitle:'My Profile',profilePic:unsecureUrl});
};

router.processChangePass = function (req,res) {
    db.query("SELECT password FROM users WHERE email = ?",[req.user.email], function(err, rows){
        if (err) throw err;

        if (!bcrypt.compareSync(req.body.curpassword, rows[0].password)){
            req.flash('message', 'Oops! Wrong password.');
            res.redirect('/profile');
        }
        else{
            var newPass = bcrypt.hashSync(req.body.newpassword, null, null);
            var insertQuery = "update users set password = ? where email = ?";
            db.query(insertQuery,[newPass,req.user.email],function(err, rows) {
                req.flash('message', 'Password Updated Successfully!');
                res.redirect('/profile');
            });
        }
    });
};


router.showSearchChecking = function (req, res) {
    res.render('checkingStats',{message: req.flash('message'),pageTitle:'Checking Statistics',addData:req.flash('addData'),addSum:req.flash('addSum'),expData:req.flash('expData'),expSum:req.flash('expSum')});
};


router.processSearchChecking = function (req, res) {
    var sd = req.body.sd;
    var ed = req.body.ed;
    var desc = req.body.desc;
    var add = req.body.add;
    var exp = req.body.exp;
    var uid = req.user.uid;

    if(!sd || !ed){
        req.flash('message','Error! You need to put in dates for your search!');
        res.redirect('back');
    }


    if(add && !exp){
        var dataQuery = 'select * from checking_add where uid = '+uid+' and (dtime between "'+sd+'" and "'+ed+'") and description like "%'+desc+'%";';
        var sumQuery = 'select sum(amount) as ss from checking_add where uid = '+uid+' and (dtime between "'+sd+'" and "'+ed+'") and description like "%'+desc+'%";';

        var FinalQry = dataQuery + sumQuery;

        db.query(FinalQry,function(err, rows, fields) {
            if(err) throw err;
            res.render('checkingStats',{message: req.flash('message'),pageTitle:'Checking Statistics',addData:rows[0],addSum:rows[1][0].ss,expData:req.flash('expData'),expSum:req.flash('expSum')});
        });


    }
    else if(!add && exp){
        var dataQuery = 'select * from checking_spent where uid = '+uid+' and (dtime between "'+sd+'" and "'+ed+'") and description like "%'+desc+'%";';
        var sumQuery = 'select sum(amount) as ss from checking_spent where uid = '+uid+' and (dtime between "'+sd+'" and "'+ed+'") and description like "%'+desc+'%";';

        var FinalQry = dataQuery + sumQuery;

        db.query(FinalQry,function(err, rows, fields) {
            if(err) throw err;
            res.render('checkingStats',{message: req.flash('message'),pageTitle:'Checking Statistics',addData:0,addSum:0,expData:rows[0],expSum:rows[1][0].ss});
        });
    }
    else if(add && exp){
        var dataQuery1 = 'select * from checking_add where uid = '+uid+' and (dtime between "'+sd+'" and "'+ed+'") and description like "%'+desc+'%";';
        var sumQuery1 = 'select sum(amount) as ss from checking_add where uid = '+uid+' and (dtime between "'+sd+'" and "'+ed+'") and description like "%'+desc+'%";';
        var dataQuery2 = 'select * from checking_spent where uid = '+uid+' and (dtime between "'+sd+'" and "'+ed+'") and description like "%'+desc+'%";';
        var sumQuery2 = 'select sum(amount) as ss from checking_spent where uid = '+uid+' and (dtime between "'+sd+'" and "'+ed+'") and description like "%'+desc+'%";';

        var FinalQry = dataQuery1 + sumQuery1 + dataQuery2 + sumQuery2;

        db.query(FinalQry,function(err, rows, fields) {
            if(err) throw err;
            res.render('checkingStats',{message: req.flash('message'),pageTitle:'Checking Statistics',addData:rows[0],addSum:rows[1][0].ss,expData:rows[2],expSum:rows[3][0].ss});
        });

    }
    else{
        req.flash('message','Error! You need to select at least one of the checkboxes!');
        res.redirect('back');
    }


};

router.showSavingsStats = function (req, res) {
    db.query("select * from savings where id in (select bid from mysavings where uid = ?);",req.user.uid,function(err, rows, fields) {
        if(err) throw err;
        res.render('savingsStats',{message: req.flash('message'),pageTitle:'Savings Statistics',addData:req.flash('addData'),addSum:req.flash('addSum'),expData:req.flash('expData'),expSum:req.flash('expSum'),mySavings:rows});
    });
};


router.processSavingsStats = function (req, res) {
    var sd = req.body.sd;
    var ed = req.body.ed;
    var desc = req.body.desc;
    var deposit = req.body.add;
    var withdraw = req.body.exp;
    var uid = req.user.uid;
    var savings = req.body.mb;//contains list of selected savings

    var commonQuery = "select * from savings where id in (select bid from mysavings where uid = "+uid+");";


    if(!sd || !ed){
        req.flash('message','Error! You need to put in dates for your search!');
        res.redirect('back');
    }


    if(deposit && !withdraw){
        var dataQuery = 'select * from deposit d join savings b on b.id = d.bid where d.uid = '+uid+' and (d.dtime between "'+sd+'" and "'+ed+'") and d.description like "%'+desc+'%" and d.bid in ('+ savings +');';
        var sumQuery = 'select sum(d.amount) as ss from deposit d join savings b on b.id = d.bid where uid = '+uid+' and (dtime between "'+sd+'" and "'+ed+'") and description like "%'+desc+'%" and d.bid in ('+ savings +');';
        //console.log(dataQuery);
        var FinalQry = dataQuery + sumQuery + commonQuery;

        db.query(FinalQry,function(err, rows, fields) {
            if(err) throw err;
            res.render('savingsStats',{message: req.flash('message'),pageTitle:'Savings Statistics',addData:rows[0],addSum:rows[1][0].ss,expData:req.flash('expData'),expSum:req.flash('expSum'),mySavings:rows[2]});
        });


    }
    else if(!deposit && withdraw){
        var dataQuery = 'select * from withdraw w join savings b on b.id = w.bid where w.uid = '+uid+' and (w.dtime between "'+sd+'" and "'+ed+'") and w.description like "%'+desc+'%" and w.bid in ('+ savings +');';
        var sumQuery = 'select sum(w.amount) as ss from withdraw w join savings b on b.id = w.bid where w.uid = '+uid+' and (w.dtime between "'+sd+'" and "'+ed+'") and w.description like "%'+desc+'%" and w.bid in ('+ savings +');';
        //console.log(dataQuery);
        var FinalQry = dataQuery + sumQuery + commonQuery;

        db.query(FinalQry,function(err, rows, fields) {
            if(err) throw err;
            res.render('savingsStats',{message: req.flash('message'),pageTitle:'Savings Statistics',addData:0,addSum:0,expData:rows[0],expSum:rows[1][0].ss,mySavings:rows[2]});
        });
    }
    else if(deposit && withdraw){
        var dataQuery1 = 'select * from deposit d join savings b on b.id = d.bid where d.uid = '+uid+' and (d.dtime between "'+sd+'" and "'+ed+'") and d.description like "%'+desc+'%" and d.bid in ('+ savings +');';
        var sumQuery1 = 'select sum(d.amount) as ss from deposit d join savings b on b.id = d.bid where uid = '+uid+' and (dtime between "'+sd+'" and "'+ed+'") and description like "%'+desc+'%" and d.bid in ('+ savings +');';

        var dataQuery2 = 'select * from withdraw w join savings b on b.id = w.bid where w.uid = '+uid+' and (w.dtime between "'+sd+'" and "'+ed+'") and w.description like "%'+desc+'%" and w.bid in ('+ savings +');';
        var sumQuery2 = 'select sum(w.amount) as ss from withdraw w join savings b on b.id = w.bid where w.uid = '+uid+' and (w.dtime between "'+sd+'" and "'+ed+'") and w.description like "%'+desc+'%" and w.bid in ('+ savings +');';

        var FinalQry = dataQuery1 + sumQuery1 + dataQuery2 + sumQuery2 + commonQuery;

        db.query(FinalQry,function(err, rows, fields) {
            if(err) throw err;
            res.render('savingsStats',{message: req.flash('message'),pageTitle:'Savings Statistics',addData:rows[0],addSum:rows[1][0].ss,expData:rows[2],expSum:rows[3][0].ss,mySavings:rows[4]});
        });

    }
    else{
        req.flash('message','Error! You need to select at least one of the checkboxes!');
        res.redirect('back');
    }

};



module.exports = router;
