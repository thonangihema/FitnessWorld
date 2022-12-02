const express = require('express');
const app = express();
const port = 3000;
const request = require('request');


const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

var serviceAccount = require("./majorprojectkey.json");

initializeApp({
    credential: cert(serviceAccount),
}); 

const db = getFirestore();
 
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render('fitnesshpage.ejs');
 });
app.get("/signup1", function(req, res) {
    res.render('signup1');
 });
 
app.get('/signupsubmit1', function(req, res) {
    
    const full_name = req.query.first_name;
    const last_name = req.query.last_name;
    const email = req.query.email;
    const password = req.query.psw;
    const rep_psw = req.query.psw_repeat;

    
    //Adding data to the collection
    if(password == rep_psw){
        db.collection('majorproject')
        .add({
            name: full_name + last_name,
            email:email,
            password: password,
        })
        .then(() => {
            res.render("signin1");
        });
    }else{
        res.send("SignUP Failed");
    }
});

app.get("/signin1", (req, res) => {
    res.render('signin1');
 }); 

app.get('/signinsubmit1', (req, res) => {
    const email = req.query.emil;
    const password = req.query.passwrd;
    db.collection('majorproject')
        .where("email", "==", email)
        .where("password", "==", password)
        .get()
      .then((docs) => {
        if(docs.size>0){

            docs.forEach(function(doc){
                var obj=doc.data();
                res.render('ftdashboard',{data:obj});
            })
        }
            else
            {
                res.render("logf");
            }
        });
 });


 
 app.listen(3000, function () {  
    console.log('Example app listening on port 3000!')  
    })
