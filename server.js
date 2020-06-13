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

// Endpoints go after this line

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
            delete: { href: `/delete/${username}` },
            edit: { href: `/edit/${username}` },
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

app.post("/delete/:user/:id", uploads.none(), async (req, res) => {
  let user = req.params.user;
  let id = req.params.id;
  try {
    await dbo
      .collection("users")
      .updateOne({ username: user }, { $pull: { books: { id: id } } });
    res.send(JSON.stringify({ success: true }));
  } catch (err) {
    console.log("book supression fail", err);
    res.send(JSON.stringify({ success: false }));
    return;
  }
});

app.post("/addBook/:user", uploads.none(), async (req, res) => {
  let user = req.params.user;
  let name = req.body.name;
  let rating = req.body.rating;
  let details = req.body.details;
  let id = "" + Math.floor(Math.random() * 1000000);

  try {
    await dbo
      .collection("users")
      .updateOne(
        { username: user },
        { $push: { books: { name, rating, details, id } } }
      );
    res.send(JSON.stringify({ success: true }));
  } catch (err) {
    console.log("book insertion fail", err);
    res.send(JSON.stringify({ success: false }));
    return;
  }
});

app.post("/edit/:user/:id", uploads.none(), async (req, res) => {
  let user = req.params.user;
  let id = req.params.id;
  let name = req.body.name;
  let rating = req.body.rating;
  let details = req.body.details;

  try {
    await dbo.collection("users").updateOne(
      { username: user, books: { $elemMatch: { id: id } } },
      {
        $set: {
          "books.$.name": name,
          "books.$.rating": rating,
          "books.$.details": details,
        },
      }
    );
    res.send(
      JSON.stringify({
        success: true,
      })
    );
  } catch (err) {
    console.log("book insertion fail", err);
    res.send(JSON.stringify({ success: false }));
    return;
  }
});

app.post("/updateProfil/:user", uploads.none(), async (req, res) => {
  console.log("updateProfil backend");
  let user = req.params.user;
  let newUsername = req.body.username;
  let newPassword = req.body.password;
  let newEmail = req.body.email;
  const sessionId = req.cookies.sid;
  sessions[sessionId] = newUsername;

  try {
    await dbo.collection("users").updateOne(
      { username: user },
      {
        $set: {
          username: newUsername,
          password: newPassword,
          email: newEmail,
        },
      }
    );
    res.send(
      JSON.stringify({
        success: true,
        HATEOAS: {
          _link: {
            fetchBooks: { href: `/fetchBooks/${username}` },
            delete: { href: `/delete/${username}` },
            edit: { href: `/edit/${username}` },
            mainPage: { href: `/mainPage/${username}` },
            updateProfil: { href: `/updateProfil/${username}` },
            addBook: { href: `/addBook/${username}` },
            logOut: { href: `/logOut` },
          },
        },
      })
    );
  } catch (err) {
    console.log("update profil fail", err);
    res.send(JSON.stringify({ success: false }));
    return;
  }
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
            delete: { href: `/delete/${username}` },
            edit: { href: `/edit/${username}` },
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
              delete: { href: `/delete/${username}` },
              edit: { href: `/edit/${username}` },
              mainPage: { href: `/mainPage/${username}` },
              updateProfil: { href: `/updateProfil/${username}` },
              addBook: { href: `/addBook/${username}` },
              logOut: { href: `/logOut` },
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

// Endpoints go before this line

app.all("/*", (req, res, next) => {
  // needed for react router
  res.sendFile(__dirname + "/build/index.html");
});

app.listen(4000, "0.0.0.0", () => {
  console.log("Server running on port 4000");
});
