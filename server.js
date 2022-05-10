"use strict;";
const express = require("express");
const cors = require("cors");
const axios = require("axios").default;
const { Client } = require("pg");
require("dotenv").config();
const PORT = 3000;
const apiKey = process.env.API_KEY;
const dbUrl = process.env.DBurl;
const app = express();
const client = new Client(dbUrl);

app.use(cors());
app.use(express.json());

//start fucntion
async function startServer() {
  try {
    const connectDB = await client.connect();
    const listenNow = await app.listen(PORT, () => {
      console.log(`Example app listening on PORT ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}
// DELETE req

app.delete("/deleteMovie", (req, res) => {
  const { movieId } = req.query;
  let sql = `DELETE FROM movie WHERE id = $1;`;
  let values = [movieId];
  client
    .query(sql, values)
    .then((result) => {
      res.send("deleted successfully NOW");
      res.status(204);
    })
    .catch((err) => {
      handleErrors(err, req, res);
    });
});
//------------------------------------------------------------

// UPDATE req

app.put("/updateMovie/:movieId", (req, res) => {
  const { movieId } = req.params;
  const { id, original_title, release_date, poster_path, overview } = req.body;
  let sql = `UPDATE movie SET id = $1, original_title = $2 , release_date = $3 , poster_path = $4, overview = $5 WHERE id = $6 RETURNING *;`;
  let values = [
    id,
    original_title,
    release_date,
    poster_path,
    overview,
    movieId,
  ];
  client
    .query(sql, values)
    .then((result) => {
      console.log(result.rows);
      res.send(result.rows);
    })
    .catch((err) => {
      handleErrors(err, req, res);
    });
});

//------------------------------------------------------------
// POST req
app.post("/addMovie", (req, res) => {
  const { id, original_title, release_date, poster_path, overview } = req.body;
  let sql = `INSERT INTO movie(id, original_title, release_date, poster_path, overview) VALUES($1, $2, $3, $4, $5)`;
  let values = [id, original_title, release_date, poster_path, overview];
  client
    .query(sql, values)
    .then((message) => {
      console.log(message);
      return res.status(201).json(message.rows);
    })
    .catch((err) => {
      handleErrors(err, req, res);
    });
});
//------------------------------------------------------------
// GET req
app.get("/", (req, res) => {
  res.send(
    "gather the json data and use it in a constructer and then use res.json the array"
  );
});
//------------------------------------------------------------
app.get("/getMovies", (req, res) => {
  let sql = `SELECT * FROM movie;`;
  client
    .query(sql)
    .then((info) => {
      console.log(info);
      return res.json(info.rows);
    })
    .catch((err) => {
      handleErrors(err, req, res);
    });
});
//------------------------------------------------------------
app.get("/getMovieId/:movieId", (req, res) => {
  const { movieId } = req.params;
  let sql = `SELECT * FROM movie WHERE id = $1`;
  let values = [movieId];
  client
    .query(sql, values)
    .then((result) => {
      console.log(result.rows);
      return res.json(result.rows);
    })
    .catch((err) => {
      handleErrors(err, req, res);
    });
});

//------------------------------------------------------------
app.get("/favorite", (req, res) => {
  res.send("Welcome to Favorite Page");
});
//------------------------------------------------------------
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
//------------------------------------------------------------
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
//------------------------------------------------------------
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
//------------------------------------------------------------
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
//------------------------------------------------------------
app.get("/error", (req, res) => {
  res.status(500).send("<h1>505! Internal Server Error</h1>");
});
//------------------------------------------------------------
app.use("*", (req, res) => {
  res.status(404).send("<h1>404! Page not found</h1>");
});
//------------------------------------------------------------
startServer();

// Functions
function Movie(id, title, release_date, poster_path, overview) {
  this.id = id;
  this.title = title;
  this.release_date = release_date;
  this.poster_path = poster_path;
  this.overview = overview;
}
function handleErrors(error, req, res) {
  res.status(500).send(error);
}
