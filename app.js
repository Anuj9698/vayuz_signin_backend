var nodemailer = require('nodemailer');
const Express = require("express");
const BodyParser = require("body-parser");
const mongoose = require("mongoose");
// const bcrypt = require("bcrypt")
const crypto = require("crypto")
const cors= require("cors")
const cookieParser = require('cookie-parser');
const UserData = require("./model/userData");

var app = Express();
app.use(cors())
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

mongoose.connect("mongodb+srv://anuj9698:" + process.env.mongodb + "@cluster0-lrfps.mongodb.net/vayuz?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

var mongoConnection = mongoose.connection;
console.log(mongoConnection.modelNames());
console.log(mongoConnection);


app.post("/signup", (request, response, next) => {
  console.log(request.body);
  const hash = crypto.createHmac('sha256', request.body.password)
    .digest('hex');
  const token = crypto.createHmac('sha256', request.body.email)
    .digest('hex');
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'anuj9698@gmail.com',
      pass: 'use your password'
    }
  });
  var otp = Math.floor(10000 + Math.random() * 90000)

  var mailOptions = {
    from: 'anuj9698@gmail.com',
    to: 'anuj9698@gmail.com',
    subject: 'otp',
    text: `your otp is ${otp}`
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  const userData = new UserData({
    _id: new mongoose.Types.ObjectId(),
    name: request.body.name,
    password: hash,
    email: request.body.email,
    location: request.body.location,
    token: token,
    otp: otp
  })
  userData.save().then(result => {
    console.log(result)
  }).catch(err => {
    console.log(err)
  })
  response.cookie("token", token);
  response.status(201).json({
    message: "hi",
    created: userData
  })
});

app.post("/signin", (request, response, next) => {
  const hash = crypto.createHmac('sha256', request.body.password)
    .digest('hex');
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'use your mail',
        pass: 'use your password'
      }
    });
    var otp = Math.floor(10000 + Math.random() * 90000)
  
    var mailOptions = {
      from: 'anuj9698@gmail.com',
      to: 'anuj9698@gmail.com',
      subject: 'otp',
      text: `your otp is ${otp}`
    };
  
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  UserData.findOne({ email: request.body.email }, function (err, data) {
    if (err) return handleError(err);

    if (request.body.email === data.email && hash === data.password) {
      UserData.updateOne({ token: request.body.token }, { otp:hash }, function (err, data) {
        if (err) return handleError(err);
        if (data) {
          response.status(201).json({
            message: "true"
          })
        }
        else {
          response.status(401).json({
            message: "false"
           
          })
        }
        
  })
}
else{
  response.status(401).json({
    message: "false"
  })
}
})
})


app.post("/emailverification", (request, response, next) => {
  console.log(request.body.token)
  console.log(request.body.otp)
  
  UserData.findOne({ token: request.body.token}, function (err, data) {
    if (err) return handleError(err);
    if (request.body.otp === data.otp) {
      console.log(data)
      response.status(201).json({
        message: "true"
      })
    }
    else {
      response.status(401).json({
        message: "false"
      })
    }
  });

})

app.post("/addinterest", (request, response, next) => {
  console.log(request.body.token)
  UserData.updateOne({ token: request.body.token }, { interest:request.body.interest }, function (err, data) {
    if (err) return handleError(err);
    if (data) {
      response.status(201).json({
        message: "true"
      })
    }
    else {
      response.status(401).json({
        message: "false"
       
      })
    }
  });
})

app.post("/getuserdetails", (request, response, next) => {
  console.log(request.body.token+"tyuio")
  UserData.findOne({ token: request.body.token }, function (err, data) {
    if (err) return handleError(err);
    if (data !== null && request.body.token === data.token) {
      console.log(data)
      response.status(201).json({
        message: "true",
        data:data
      })
    }
    else {
      response.status(401).json({
        message: "false"
      })
    }
  });
})

//  app.get('/test', (req, res) => {
//       // TEsting mongodb connection
//       console.log("Trying to insert data in mongodb");
//       const user = new UserData({
//         _id:new mongoose.Types.ObjectId(),
// 	      name: "Anuj",
//         password: "1234",
//         email: "Anuj",
//         location: "Anuj",
//         otp: "Anuj",
//         token:"Anuj"
//       });
//       user.save(function(err,data){
//         console.log("Error",err,"dtat",data);
//       });
//       res.send("Send ho gya");
//  });


// app.post("/totp-generate", (request, response, next) => { });
// app.post("/totp-validate", (request, response, next) => { });

app.listen(8000, () => {
  console.log("----------------------- SERVER STARTED -----------------------------------");
  console.log("Listening at :8000...");
});

// var transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'anuj9698@gmail.com',
//     pass: ''
//   }
// });

// var mailOptions = {
//   from: 'anuj9698@gmail.com',
//   to: 'anuj@gmail.com',
//   subject: 'Sending Email using Node.js',
//   text: `Hi Achal,ghar pahuch gya.`
//   // html: '<h1>Hi Smartherd</h1><p>Your Messsage</p>'        
// };

// transporter.sendMail(mailOptions, function(error, info){
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//   }
// });