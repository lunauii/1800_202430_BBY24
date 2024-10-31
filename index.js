// https://expressjs.com/en/guide/routing.html

// REQUIRES
const express = require("express");
const app = express();
app.use(express.json());
const fs = require("fs");

// set the paths variable to a dictionary set in paths.json
const paths = require("./paths.json");

// Virtual paths!
app.use("/scripts", express.static("./public/scripts"));
app.use("/styles", express.static("./public/styles"));
app.use("/images", express.static("./public/images"));
app.use("/text", express.static("./public/text"));

// loop through each paths.json dictionary key route them to the dictionary value
routes.forEach(paths => {
    app.get(paths.path, function (req, res) {
        let doc = fs.readFileSync(paths.file, "utf8");
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