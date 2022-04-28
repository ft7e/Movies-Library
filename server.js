"use strict;";
const express = require("express");
const cors = require("cors");
const axios = require("axios").default;
require("dotenv").config();
const PORT = 3000;
const apiKey = process.env.API_KEY;
const app = express();

// const moviesData = require("./MoviesData/./data.json");
// const apiKey = API_KEY;

app.use(cors());
app.get("/", (req, res) => {
  res.send(
    "gather the json data and use it in a constructer and then use res.json the array"
  );
});

app.get("/favorite", (req, res) => {
  res.send("Welcome to Favorite Page");
});

app.get("/trending", (req, res) => {
  movieUrl = `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}&language=en-US`;
  axios
    .get(movieUrl)
    .then((info) => {
      console.log(info.data.results);
      let result = info.data.results.map((element) => {
        return new Movie(
          element.id,
          element.original_title,
          element.release_date,
          element.poster_path,
          element.overview
        );
      });
      res.json(result);
    })
    .catch((error) => {
      console.log(error);
      res.send("inside catch");
    });
});

app.get("/search", (req, res) => {
  let movieName = req.query.movieName;

  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${movieName}`;
  axios
    .get(url)
    .then((info) => {
      console.log(info.data.results);
      let result = info.data.results.map((element) => {
        return new Movie(
          element.id,
          element.original_title,
          element.release_date,
          element.poster_path,
          element.overview
        );
      });
      res.json(result);
    })
    .catch((error) => {
      console.log(error);
    });
});
app.get("/new", (req, res) => {
  let url = `https://api.themoviedb.org/3/movie/76341?api_key=${apiKey}&language=de`;
  axios
    .get(url)
    .then((result) => {
      res.json(result.data);
    })
    .catch((error) => {
      console.log(error);
    });
});
app.get("/popular", (req, res) => {
  let url = ` https://api.themoviedb.org/3/movie/76341?api_key=${apiKey}`;
  axios
    .get(url)
    .then((result) => {
      res.json(result.data);
    })
    .catch((error) => {
      console.log(error);
    });
});
app.get("/error", (req, res) => {
  res.status(500).send("<h1>505! Internal Server Error</h1>");
});

app.use("*", (req, res) => {
  res.status(404).send("<h1>404! Page not found</h1>");
});

app.listen(PORT, () => {
  console.log(`Example app listening on PORT ${PORT}`);
});

// Functions
function Movie(id, title, release_date, poster_path, overview) {
  this.id = id;
  this.title = title;
  this.release_date = release_date;
  this.poster_path = poster_path;
  this.overview = overview;
}
