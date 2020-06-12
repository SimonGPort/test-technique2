let express = require("express");
let app = express();
let reloadMagic = require("./reload-magic.js");
let multer = require("multer");
let uploads = multer({
  dest: __dirname + "/uploads",
});
require("dotenv").config();
let mongodb = require("mongodb");
let MongoClient = mongodb.MongoClient;
let ObjectId = mongodb.ObjectID;
let dbo = undefined;
let url = process.env.MONGO_ACCESS;
// let url =
//   "mongodb+srv://bob:bobsue@cluster0-moshr.azure.mongodb.net/Test-books?retryWrites=true&w=majority";
MongoClient.connect(url, { useUnifiedTopology: true })
  .then((client) => {
    dbo = client.db("Test-books");
  })
  .catch((err) => console.log(err));
const cookieParser = require("cookie-parser");
app.use(cookieParser());
reloadMagic(app);

app.use("/", express.static("build")); // Needed for the HTML and JS files
app.use("/", express.static("public")); // Needed for local assets

const sessions = {};
// Your endpoints go after this line

app.post("/autoLogin", async (req, res) => {
  let sessionId = req.cookies.sid;
  let username = sessions[sessionId];
  if (username === undefined) {
    console.log("an user enter the website without autoLogin");
    res.send(JSON.stringify({ success: false }));
  } else {
    console.log("an user enter the website with autoLogin");
    res.send(
      JSON.stringify({
        success: true,
        HATEOAS: {
          _link: {
            fetchBooks: { href: `/fetchBooks/${username}` },
            mainPage: { href: `/mainPage/${username}` },
            updateProfil: { href: `/updateProfil/${username}` },
            addBook: { href: `/addBook/${username}` },
            logOut: { href: `/logOut` },
          },
        },
      })
    );
  }
});

app.post("/logOut", uploads.none(), async (req, res) => {
  const sessionId = req.cookies.sid;
  delete sessions[sessionId];
  console.log("logout sucess");
  res.send(JSON.stringify({ success: true }));
});

app.post("/register", uploads.none(), async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let email = req.body.email;
  let books = [];
  try {
    const user = await dbo.collection("users").findOne({ username: username });
    if (user) {
      return res.send(JSON.stringify({ success: false, reason: "nameTaken" }));
    }
    await dbo
      .collection("users")
      .insertOne({ username, password, email, books });

    let sessionId = "" + Math.floor(Math.random() * 1000000);
    sessions[sessionId] = req.body.username;
    res.cookie("sid", sessionId);
    res.send(
      JSON.stringify({
        success: true,
        HATEOAS: {
          _link: {
            fetchBooks: { href: `/fetchBooks/${username}` },
            mainPage: { href: `/mainPage/${username}` },
            updateProfil: { href: `/updateProfil/${username}` },
            addBook: { href: `/addBook/${username}` },
            logOut: { href: `/logOut` },
          },
        },
      })
    );
  } catch (err) {
    console.log("/signup error", err);
    res.send(JSON.stringify({ success: false, reason: "connectionFailed" }));
    return;
  }
});

app.get("/fetchBooks/:username", async (req, res) => {
  let username = req.params.username;
  try {
    const user = await dbo.collection("users").findOne({ username });
    let books = user.books;
    res.send(JSON.stringify({ success: true, books }));
  } catch (err) {
    res.send(JSON.stringify({ success: false }));
  }
});

app.get("/login/:username/:password", async (req, res) => {
  let username = req.params.username;
  let password = req.params.password;
  // let username = req.body.username;
  // let password = req.body.password;
  console.log("login:", username, password);
  try {
    const user = await dbo.collection("users").findOne({ username, password });
    if (user) {
      let sessionId = "" + Math.floor(Math.random() * 1000000);
      sessions[sessionId] = username;
      res.cookie("sid", sessionId);
      res.send(
        JSON.stringify({
          success: true,
          HATEOAS: {
            _link: {
              fetchBooks: { href: `/fetchBooks/${username}` },
              mainPage: { href: `/mainPage/${username}` },
              updateProfil: { href: `/updateProfil/${username}` },
              addBook: { href: `/addBook/${username}` },
              logOut: { href: "/logOut" },
            },
          },
        })
      );
      return;
    }
    return;
  } catch (err) {
    console.log("login error", err);
    res.send(JSON.stringify({ success: false }));
    return;
  }
});

// Your endpoints go before this line

app.all("/*", (req, res, next) => {
  // needed for react router
  res.sendFile(__dirname + "/build/index.html");
});

app.listen(4000, "0.0.0.0", () => {
  console.log("Server running on port 4000");
});
