// https://expressjs.com/en/guide/routing.html

// REQUIRES
const express = require("express");
const app = express();
app.use(express.json());
const fs = require("fs");

// Virtual paths!
app.use("/scripts", express.static("./public/scripts"));
app.use("/styles", express.static("./public/styles"));
app.use("/images", express.static("./public/images"));
app.use("/text", express.static("./public/text"));

app.get("/", function (req, res) {
    //console.log(process.env);
    // retrieve and send an HTML document from the file system
    let doc = fs.readFileSync("./app/html/index.html", "utf8");
    res.send(doc);
});

app.get("/login", function (req, res) {
    //console.log(process.env);
    // retrieve and send an HTML document from the file system
    let doc = fs.readFileSync("./app/html/login.html", "utf8");
    res.send(doc);
});

app.get("/main", function (req, res) {
    //console.log(process.env);
    // retrieve and send an HTML document from the file system
    let doc = fs.readFileSync("./app/html/main.html", "utf8");
    res.send(doc);
});

app.get("/about", function (req, res) {
    //console.log(process.env);
    // retrieve and send an HTML document from the file system
    let doc = fs.readFileSync("./app/html/about.html", "utf8");
    res.send(doc);
});

app.get("/FAQ", function (req, res) {
    //console.log(process.env);
    // retrieve and send an HTML document from the file system
    let doc = fs.readFileSync("./app/html/FAQ.html", "utf8");
    res.send(doc);
});

app.get("/features", function (req, res) {
    //console.log(process.env);
    // retrieve and send an HTML document from the file system
    let doc = fs.readFileSync("./app/html/features.html", "utf8");
    res.send(doc);
});

// for resource not found (i.e., 404)
app.use(function (req, res, next) {
    // this could be a separate file too - but you'd have to make sure that you have the path
    // correct, otherewise, you'd get a 404 on the 404 (actually a 500 on the 404)
    res.status(404).send("<html><head><title>404 - Not Found</title></head><body><p>Website not found!</p></body></html>");
});

// RUN SERVER
let port = 8000;
app.listen(port, function () {
    console.log("Testing, testing. Check port " + port + ".");
});