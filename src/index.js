var apiKey = "0473aad0ca0170f5034bf67b5477f45e";

function httpGetAsync(theUrl, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
      callback(xmlHttp.responseText);
  };
  xmlHttp.open("GET", theUrl, true);
  xmlHttp.send(null);
}

window.search = function search() {
  var searchInputElement = document.getElementById("search").value;
  httpGetAsync(
    "https://api.themoviedb.org/3/search/movie?api_key=" +
      apiKey +
      "&language=en-US&query=" +
      searchInputElement +
      "&page=1&include_adult=false",
    function(json) {
      showSearch();
      hideMovie();
      var result = JSON.parse(json);
      var moviesListElement = document.getElementById("movies");
      var movieList = "";

      if (result["results"].length === 0) {
        alert("Not found");
        return;
      }
      for (var i = 0; i < result["results"].length; i++) {
        movieList +=
          "<li onclick=openMovie(" +
          result["results"][i]["id"] +
          ")><a href='#'>" +
          result["results"][i]["original_title"] +
          "</a></li>";
      }
      moviesListElement.innerHTML = movieList;
    }
  );
};

window.openMovie = function openMovie(idMovie) {
  httpGetAsync(
    "https://api.themoviedb.org/3/movie/" + idMovie + "?api_key=" + apiKey,
    function(json) {
      hideSearch();
      showMovie();
      var jsonObj = JSON.parse(json);
      var content = document.getElementById("title");
      var image = document.getElementById("img");
      var view = document.getElementById("descript");

      content.textContent = jsonObj["original_title"];
      image.src =
        "https://image.tmdb.org/t/p/w600_and_h900_bestv2" +
        jsonObj["poster_path"];
      view.textContent = jsonObj["overview"];
      findRecomendations(idMovie);
    }
  );
};

function findRecomendations(idMovieRec) {
  httpGetAsync(
    "https://api.themoviedb.org/3/movie/" +
      idMovieRec +
      "/recommendations?api_key=" +
      apiKey +
      "&language=en-US&page=1",
    function(json) {
      var recommedsResult = JSON.parse(json);
      var rec_list = document.getElementById("recomend_list");
      var movieListRecomed = "";
      for (var i = 0; i <= 2; i++) {
        movieListRecomed +=
          "<li onclick=openMovie(" +
          recommedsResult["results"][i]["id"] +
          ") ><a href='#'>" +
          recommedsResult["results"][i]["original_title"] +
          "</a></li>";
      }
      rec_list.innerHTML = movieListRecomed;
    }
  );
}

function hideSearch() {
  document.getElementById("movies").style.display = "none";
}
function showSearch() {
  document.getElementById("movies").style.display = "block";
}
function hideMovie() {
  document.getElementById("movie").style.display = "none";
}
function showMovie() {
  document.getElementById("movie").style.display = "block";
}
