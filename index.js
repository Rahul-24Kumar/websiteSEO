// mongoose.set("strictQuery", false);
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
// const multer = require("multer");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static("public"));
dotenv.config();

let port = process.env.PORT;
let databaseUrl = process.env.DB_URL;
let userName = process.env.USER_NAME;
let passWord = process.env.PASS_WORD;
let adminMail = process.env.TO;
let hostMail = process.env.HOST;

mongoose
  .connect(databaseUrl, {
    useNewUrlParser: true,
  })
  .then(() => console.log("mongoDb Is Connected"))
  .catch((err) => console.log(err));

const nameSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    lowercase: true,
    trim: true,
  },

  number: {
    type: Number,
    trim: true,
  },

  subject: {
    type: String,
    required: [true, "Please write some message. It can not be empty!"],
  },

  message: {
    type: String,
    required: [true, "Please write some message. It can not be empty!"],
  },
});

var User = new mongoose.model("mail", nameSchema);

app.post("/handleData", async (req, res) => {
  console.log(req.body);
  if (Object.keys(req.body).length <= 0) {
    console.log("error");
  }
  var myData = await User.create(req.body);
  console.log(typeof myData);

  var transport = nodemailer.createTransport({
    host: hostMail,
    port: 587,
    auth: {
      user: userName,
      pass: passWord,
    },
  });

  var mailOptions = {
    from: req.body.email,
    to: adminMail,
    subject: "review message",
    html: `<h2>User details :</h2> <br> ${myData.name}, <br> ${myData.email}, <br>  ${myData.subject}, <br> ${myData.message}, <br> ${myData.number} `,
  };

  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }

    console.log("Email sent: " + info.response);
  });

  return res.redirect("back");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});

















//app.post("/sendemail", async function (req, res) {
//   var myData = await User.create(req.body);

//   var storage = multer.diskStorage({
//     destination: function (request, file, callback) {
//       callback(null, "./upload");
//     },

//     filename: function (request, file, callback) {
//       var temp_file_arr = file.originalname.split(".");

//       var temp_file_name = temp_file_arr[0];

//       var temp_file_extension = temp_file_arr[1];

//       callback(
//         null,
//         temp_file_name + "-" + Date.now() + "." + temp_file_extension
//       );
//     },
//   });

//   var upload = multer({ storage: storage }).single("sample_image");

//   upload(request, response, function (error) {
//     if (error) {
//       return response.end("Error Uploading File");
//     } else {
//       return response.end("File is uploaded successfully");
//     }
//   });

//   var transport = nodemailer.createTransport({
//     host: hostMail,
//     port: 587,
//     auth: {
//       user: userName,
//       pass: passWord,
//     },
//   });
//   var mailOptions = {
//     from: req.body.email,
//     to: adminMail,
//     subject: "review message",
//     html: `<h2>User details :</h2> <br> ${myData.name}, <br> ${myData.email}, <br>  ${myData.subject}, <br> ${myData.message}, <br> ${myData.number} `,
//     attachments: [
//       {
//         filename: upload.filename,
//         // path: req.file.path,
//       },
//     ],
//   };

//   transport.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       return console.log(error);
//     }

//     console.log("Email sent: " + info.response);
//   });

//   return res.redirect("back");
// });
