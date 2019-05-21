var express = require("express");
var bodyParser  = require("body-parser");
var app =  express();
var cors = require('cors');
var ObjectId = require('mongodb').ObjectId;
const MongoClient = require('mongodb').MongoClient;
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(express.static('assets'));
let db;
var url = "mongodb://localhost:27017/ecommerce";

MongoClient.connect(url,(err, database) =>
{
  if(err)
  {
  	return console.log(err);
  }
  db = database;
});

app.get('/',function(req,res){
  res.sendFile(__dirname+"index.html");
});

app.use(cors());
app.post('/createUser',function(req,res){
    var user_name=req.body.name;
    var password=req.body.password;
    var email=req.body.email;
    var mobile=req.body.mobile;
    var data = {name:user_name, email:email, mobile:mobile, password:password};
    db.collection('userdetails').findOne({mobile:mobile}, function(err, result) {
      if(result==null) { 
          db.collection('userdetails').insertOne(data, (err, result) => {
            if (err) {
              res.json({
                  status: 401,
                  message:'Something went wrong',
                  err: err
              })
            } else {
              res.json({
                  status: 200,
                  message:'User created successfully!',
                  data: result
              })
            }
          });
      } else {
            res.json({
              status: 401,
              message:'Mobile number alredy exist',
              err:err
            })
      }
    });

})
app.post('/getUsers',(req, res) => {
  db.collection('userdetails').find({}).toArray(function(err, result) {
      if(err) {
            res.json({
              status: 401,
              message: 'Something went wrong',
              err: err
            })
      } else {
              res.json({
                status:200,
                message:'User Details',
                data: result
              })
      }
      
  })
})
app.post('/deleteUsers',(req, res) => {
    console.log("deleteUsers:");
    console.log("req.body:",req.body)
    var user_name=req.body.name;
    var password=req.body.password;
    var email=req.body.email;
    var mobile=req.body.mobile;
    var data = {name:user_name, email:email, mobile:mobile, password:password};
    db.collection('userdetails').findOne({mobile:mobile}, function(err, result) {
      console.log("result:",result)
    if(result!=null) {
      db.collection('userdetails').deleteOne(result, function(err, result) {
        if(err) {
                res.json({
                  status:401,
                  message: 'Something went wrong',
                  err: err
                })
        } else {
                res.json({
                  status:200,
                  message:'Delete successfully',
                  data: result
                })
        }
      })
    } else {
                res.json({
                  status:401,
                  message: 'The User Name not found',
                  err: err
                })

    }

    })
})
app.get('/user_details',function(req,res){
  res.sendFile(__dirname+"/assets/view.html");
});
app.post('/getUserDetails', (req, res) => {
  var id = req.body._id;
  db.collection('userdetails').findOne({_id:ObjectId(id)}, function(err, result) {
     console.log('err', err);
     console.log('result', result);
      if(err || result==null) {
            res.json({
              status: 401,
              message: 'User Details not found',
              err: err
            })
      } else {
              res.json({
                status:200,
                message:'User Details',
                data: result
              })
      }
      
  })
})

app.listen(5000,function(){
  console.log("Started on PORT 5000");
})