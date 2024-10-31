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

// match vpaths to actual file paths
const routes = [
    { path: "/", file: "./app/html/index.html" },
    { path: "/login", file: "./app/html/login.html" },
    { path: "/main", file: "./app/html/main.html" },
    { path: "/about", file: "./app/html/about.html" },
    { path: "/FAQ", file: "./app/html/FAQ.html" },
    { path: "/features", file: "./app/html/features.html" }
];

// loop through each routes dictionary value and create app.get handlers
routes.forEach(route => {
    app.get(route.path, function (req, res) {
        let doc = fs.readFileSync(route.file, "utf8");
        res.send(doc);
    });
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
    console.log("localhost:" + port);
});