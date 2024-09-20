// mongodb
require("./config/db");
require("dotenv").config();
require("./passportAuth/passport-jwt-strategy.js");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const UserRouter = require("./api/User");
const UserDetailsRouter = require("./api/userDetails");
const express = require("express");
const port = 8000;
const passport = require("./passportAuth/passport");
const googleAuthRoute = require("./passportAuth/googleAuth");
const facebookAuthRoute = require("./passportAuth/facebookAuth");
const session = require("express-session");
const decryptMiddleware = require("./middleware/decryptMiddleware");
const AudioRoute = require("./api/Audio");
const SOAPNoteRoute = require("./api/soapNote");
const paymentRoute = require("./api/payment");
const userPassword = require("./api/userPassword");
const stripeRoute = require('./api/stripeSubscribePayment');

const app = express();
// to verify signature of stripe webhooks we need unaltered raw data
app.use('/api/webhook', express.raw({ type: 'application/json' })); // this line has to be before app.use(express.json());
app.use(express.json({ limit: "100mb" }));

// const isProduction = process.env.NODE_ENV === 'production';
// setting server and client url based on Env
const currentClientUrl = process.env.BACKEND_SERVER ==="true"
    ? process.env.AWS_CLIENT_URL
    : (process.env.DEV_SERVER ==="true" && process.env.BACKEND_SERVER==='false')
    ? process.env.DEV_CLIENT_URL
    : process.env.CLIENT_URL;
const currentServerUrl = process.env.BACKEND_SERVER === "true"
    ? process.env.AWS_SERVER_URL
    : (process.env.DEV_SERVER==="true" && process.env.BACKEND_SERVER==='false')
    ? process.env.DEV_SERVER_URL
    : process.env.SERVER_URL;
console.log("CurrentClientUrl in server js file is ", currentClientUrl);

app.use(
  session({
    secret: "your-secret-key", // Replace with a random secret key
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
// app.use(passport.session());



app.use(
  cors({
    // origin:['https://qurenote.com', 'https://www.qurenote.com'] ,
     origin: currentClientUrl ,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// for cookie parser setting the cookie and removing the cookie
app.use(cookieParser());

app.use(express.static("public"));
app.set("views", __dirname + "/views");

app.engine("html", require("ejs").renderFile);

// for accepting post from data
const bodyParser = require("express").json;
app.use(bodyParser());

// Define routes
const apiRouter = express.Router();

// Routes
apiRouter.use(express.json()); // Assuming you are using JSON middleware
apiRouter.use("/user", decryptMiddleware, UserRouter);
apiRouter.use("/userDetails",  UserDetailsRouter);
// apiRouter.get("/userDetails", UserDetailsRouter);
// apiRouter.post("/personalInfo", personalInfoRouter);
// apiRouter.post("/userInfo", userInfoROuter);
// google auth route
apiRouter.use("/auth", googleAuthRoute);
// facebook auth route
apiRouter.use("/auth", facebookAuthRoute);
// route for audio trancription
apiRouter.post("/transcribe", AudioRoute);
// route for userPassword
apiRouter.post("/userPassword", userPassword);

// Use the global /api route
app.use("/api", apiRouter);

// route for saving & getting soapnote details
app.post("/api/soapNote", SOAPNoteRoute);
app.post("/api/soapNote/history", SOAPNoteRoute);
app.post("/api/soapNote/details", SOAPNoteRoute);
app.use("/api", paymentRoute);
app.use("/api/userPassword", userPassword);
app.post("/api/soapNote/delete", SOAPNoteRoute);

app.post('api/stripe/webhook', stripeRoute);
//app.post('/api/user/singin',UserRouter);
// app.listen(port,process.env.HOSTNAME, () => {
//     console.log(`Server running on port ${process.env.HOSTNAME}:${port}`);
// })

app.listen(port, () => {
  console.log(`Server running at ${currentServerUrl} on port ${port}`);
});
