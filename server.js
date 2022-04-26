"use strict;";
const express = require("express");
const app = express();
const port = 3000;
const moviesData = require("./MoviesData/./data.json");
app.get("/", (req, res) => {
  let movie = new Movie(
    moviesData.title,
    moviesData.poster_path,
    moviesData.overview
  );
  res.json(movie);
});

app.get("/favorite", (req, res) => {
  res.send("Welcome to Favorite Page");
});

app.get("/error", (req, res) => {
  res.status(500).send("<h1>505! Internal Server Error</h1>");
});

app.get("*", (req, res) => {
  res.status(404).send("<h1>404! Page not found</h1>");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// Functions
function Movie(title, posterPath, overView) {
  this.title = title;
  this.posterPath = posterPath;
  this.overView = overView;
}
