import express from "express";
import path from "path";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
// const collection = require("./config");
// import config from "./config.js";

//creating a database//
mongoose
  .connect("mongodb://127.0.0.1:27017", {
    dbName: "Kabootar",
  })
  .then(() => {
    console.log("DataBase Connected");
  })
  .catch((e) => {
    console.log(e);
  });

const kabootarSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  yyear: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
});

const collection = new mongoose.model("users", kabootarSchema);
//ending the database

//creating a server
const app = express();

// setting view engine
app.set("view engine", "ejs");
// adding static folder path to all the files in
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

//rendering login
app.get("/login", (req, res) => {
  res.render("login");
});

//rendering login
app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/home", (req, res) => {
  res.render("home");
});
app.get("/Dashborard", (req, res) => {
  res.render("Dashborard", {
    mail: globalUser.email,
    name: globalUser.name,
    year: globalUser.yyear,
    course: globalUser.course,
  });
});
app.get("/Aboutus", (req, res) => {
  res.render("Aboutus", {
    mail: globalUser.email,
    name: globalUser.name,
    year: globalUser.yyear,
    course: globalUser.course,
  });
});
app.get("/setting", (req, res) => {
  res.render("setting", {
    mail: globalUser.email,
    name: globalUser.name,
    year: globalUser.yyear,
    course: globalUser.course,
  });
});
app.get("/Notes", (req, res) => {
  res.render("Notes", {
    mail: globalUser.email,
    name: globalUser.name,
    year: globalUser.yyear,
    course: globalUser.course,
  });
});
app.get("/pyq", (req, res) => {
  res.render("pyq", {
    mail: globalUser.email,
    name: globalUser.name,
    year: globalUser.yyear,
    course: globalUser.course,
  });
});
app.get("/mockquiz", (req, res) => {
  res.render("mockquiz", {
    mail: globalUser.email,
    name: globalUser.name,
    year: globalUser.yyear,
    course: globalUser.course,
  });
});
app.get("/schedule", (req, res) => {
  res.render("schedule", {
    mail: globalUser.email,
    name: globalUser.name,
    year: globalUser.yyear,
    course: globalUser.course,
  });
});

let currentUser;
app.post("/signup", async (req, res) => {
  const data = {
    email: req.body.mail,
    password: req.body.password,
    yyear: req.body.year,
    name: req.body.name,
    course: req.body.course,
  };

  currentUser = data.email;
  const existingUser = await collection.findOne({ email: data.email });
  console.log(collection.findOne({ email: "rithik" }));
  if (existingUser) {
    res.send(
      '<script>alert("Already Used");</script><meta http-equiv="refresh" content="3;url=/signup">'
    );
  } else {
    const saltrounds = 10;
    const hashedPass = await bcrypt.hash(data.password, saltrounds);
    data.password = hashedPass;
    const userdata = await collection.insertMany(data);

    res.send(
      '<script>alert("Account Successfully Created! PLease Login"); window.location.href="/login";</script>'
    );
    // console.log(req.body.year,);
  }
});

//login user
let globalUser;
app.post("/login", async (req, res) => {
  try {
    const check = await collection.findOne({ email: req.body.username });
    if (!check) {
      res.send(
        '<script>alert("User Not found");</script><meta http-equiv="refresh" content="3;url=/login">'
      );
    }

    globalUser = check;
    const isPassMatch = await bcrypt.compare(req.body.password, check.password);
    // console.log(req.body.username);
    if (isPassMatch) {
      res.redirect("Dashborard");
    } else {
      res.send(
        '<script>alert("Wrong Password");</script><meta http-equiv="refresh" content="3;url=/login">'
      );
    }
  } catch {
    res.send(
      '<script>alert("Wrong Details");</script><meta http-equiv="refresh" content="3;url=/login">'
    );
  }
});

app.post("/logout", (req, res) => {
  res.send(
    '<script>alert("Logout Successfull"); window.location.href="/login";</script>'
  );
  globalUser = null;
});
app.post("/passchange", (req, res) => {
  const newpass = req.body.passchange;
  changePassword(globalUser.email, newpass);
  res.send(
    '<script>alert("Password Changed successgully"); window.location.href="/login";</script>'
  );
});
app.post("/yearchange", (req, res) => {
  const newYear = req.body.yearchange;
  changeYear(globalUser.email, newYear);
  res.send(
    '<script>alert("Year Changed successgully"); window.location.href="/login";</script>'
  );
});
app.post("/emailchange", (req, res) => {
  const newemail = req.body.emailchange;
  changeEmail(globalUser.email, newemail);
  res.send(
    '<script>alert("Email Changed successgully"); window.location.href="/login";</script>'
  );
});
app.post("/namechange", (req, res) => {
  const newName = req.body.namechange;
  changeName(globalUser.email, newName);
  res.send(
    '<script>alert("Name Changed successgully"); window.location.href="/login";</script>'
  );
});

app.listen(5000, () => {
  console.log("Server is wroking");
});

async function changePassword(email, newPassword) {
  try {
    const saltrounds = 10;
    const hashedPass = await bcrypt.hash(newPassword, saltrounds);
    newPassword = hashedPass;
    const updatedUser = await collection.findOneAndUpdate(
      { email: email },
      { $set: { password: newPassword } },
      { new: true }
    );

    if (updatedUser) {
      console.log("Password updated successfully");
    } else {
      console.log("User not found");
    }
  } catch (error) {
    console.error("Error updating password:", error);
  }
}
async function changeName(email, newName) {
  try {
    const updatedUser = await collection.findOneAndUpdate(
      { email: email },
      { $set: { name: newName } },
      { new: true }
    );

    if (updatedUser) {
      console.log("Name updated successfully");
    } else {
      console.log("User not found");
    }
  } catch (error) {
    console.error("Error updating password:", error);
  }
}
async function changeYear(email, newYear) {
  try {
    const updatedUser = await collection.findOneAndUpdate(
      { email: email },
      { $set: { yyear: newYear } },
      { new: true }
    );

    if (updatedUser) {
      console.log("Year updated successfully");
    } else {
      console.log("User not found");
    }
  } catch (error) {
    console.error("Error updating password:", error);
  }
}
async function changeEmail(email, newEmail) {
  try {
    const updatedUser = await collection.findOneAndUpdate(
      { email: email },
      { $set: { email: newEmail } },
      { new: true }
    );

    if (updatedUser) {
      console.log("Email updated successfully");
    } else {
      console.log("User not found");
    }
  } catch (error) {
    console.error("Error updating password:", error);
  }
}
