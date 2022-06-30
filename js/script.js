// // array movies
// const moviesAll = [
//   {
//     image: 'https://img.elo7.com.br/product/original/3FBA809/big-poster-filme-batman-2022-90x60-cm-lo002-poster-batman.jpg',
//     title: 'Batman',
//     rating: 9.2,
//     year: 2022,
//     description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
//     isFavorited: false
//   },
//   {
//     image: 'https://upload.wikimedia.org/wikipedia/pt/thumb/9/9b/Avengers_Endgame.jpg/250px-Avengers_Endgame.jpg',
//     title: 'Avengers',
//     rating: 9.2,
//     year: 2019,
//     description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
//     isFavorited: true
//   },
//   {
//     image: 'https://upload.wikimedia.org/wikipedia/en/1/17/Doctor_Strange_in_the_Multiverse_of_Madness_poster.jpg',
//     title: 'Doctor Strange',
//     rating: 9.2,
//     year: 2022,
//     description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
//     isFavorited: false
//   },
// ]

import apikey from "./apikey.js"

const moviesList = document.querySelector('#movies-list')
const input = document.querySelector('[name="search-movie"]')
const searchButton = document.querySelector('.icon-search')

const loading = document.querySelector('.loading')
const error = document.querySelector('.erro')
error.style.cssText = 'text-align:center;font-size:1.25rem'

searchButton.addEventListener('click', searchMovie)

input.addEventListener('keyup', function(event){
  // console.log(event.key)
  if (event.keyCode == 13) {
    searchMovie()
    return
  }
})

// search movie
async function searchMovie() {
  const inputValue = input.value
  let movies;
  if (inputValue != '') {
    cleanAllMovies()
    movies = await getSearchMovie(inputValue)
    movies.forEach(movie => createMovie(movie));
  } else {
    cleanAllMovies()
    movies = await getPopularMovies()
    movies.forEach(movie => createMovie(movie));
  }
}

// clean movies
function cleanAllMovies() {
  moviesList.innerHTML = ''
}

// api
async function getPopularMovies() {
  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apikey}`
  const response = await fetch(url)
  const { results } = await response.json()
  loading.setAttribute('hidden', 'hidden')
  if (response.status == 404) {
    error.textContent = "Erro no carregamento"
  }
  return results
}

// button favorite movie
function favoriteButtonPressed(event, movie) {
  const favoriteState = {
    favorited: 'images/heart-full.svg',
    notFavorited: 'images/heart.svg'
  }
  if (event.target.src.includes(favoriteState.notFavorited)) {
    event.target.src = favoriteState.favorited
    saveToLocalStorage(movie)
  } else {
    event.target.src = favoriteState.notFavorited
    removeFromLocalStorage(movie.id)
  }
}

// get favorites
function getFavoriteMovies() {
  return JSON.parse(localStorage.getItem('favoriteMovies'))
}

// save local storage
function saveToLocalStorage(movie) {
  const movies = getFavoriteMovies() || []
  movies.push(movie)
  const movieJSON = JSON.stringify(movies)
  localStorage.setItem('favoriteMovies', movieJSON)
}

// check movie
function checkMovieIsFavorited(id) {
  const movies = getFavoriteMovies() || []
  return movies.find(movie => movie.id == id)
}

// remove local storage
function removeFromLocalStorage(id) {
  const movies = getFavoriteMovies() || []
  const findMovie = movies.find(movie => movie.id == id)
  const newMovies = movies.filter(movie => movie.id != findMovie.id)
  localStorage.setItem('favoriteMovies', JSON.stringify(newMovies))
}

// search movie
async function getSearchMovie(title) {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apikey}&query=${title}`
  const response = await fetch(url)
  const { results } = await response.json()
  // loading.setAttribute('hidden', 'hidden')
  // console.table(results) 
  return results
}

// load
window.onload = async () => {
  const movies = await getPopularMovies()
  movies.forEach(movie => createMovie(movie))
}

// create movie
const createMovie = (movie) =>{ 
  const {id, poster_path, title, release_date, vote_average, overview} = movie
  const isFavorited = checkMovieIsFavorited(id)

  // movie
  const movieElement= document.createElement('div')
  movieElement.classList.add('movie')
  moviesList.appendChild(movieElement)

  // movie image
  const movieImage = document.createElement('div')
  movieImage.classList.add('image')
  
  const image = `https://image.tmdb.org/t/p/w500${poster_path}`
  const imgSrc = document.createElement('img')
  imgSrc.setAttribute('src', image, 'alt', title)
  movieImage.appendChild(imgSrc)
  movieElement.appendChild(movieImage)
  
  // movie title
  const movieTitle = document.createElement('div')
  movieTitle.classList.add('title')
  
  const year = new Date(release_date).getFullYear()
  const h3 = document.createElement('h3')
  h3.textContent = `${title} (${year})`
  movieTitle.appendChild(h3)

  // rating and favorites
  const ratingFavorites = document.createElement('div')
  ratingFavorites.classList.add('rating-favorites')
  
  // rating
  const ratingElement = document.createElement('div')
  ratingElement.classList.add('rating')
  
  const imgRatingElement = document.createElement('img')
  imgRatingElement.setAttribute('src', 'images/star.svg', 'alt', 'Rating')

  const valueRating = document.createElement('span')
  valueRating.textContent = vote_average

  ratingElement.appendChild(imgRatingElement)
  ratingElement.appendChild(valueRating)
  ratingFavorites.appendChild(ratingElement)

  // favorites
  const favoritesElement = document.createElement('div')
  favoritesElement.classList.add('favorites')
  
  const imgFavoritesElement = document.createElement('img')
  imgFavoritesElement.setAttribute('src', isFavorited ? 'images/heart-full.svg' : 'images/heart.svg', 'alt', 'Favorites')
  imgFavoritesElement.classList.add('favoriteImage')
  imgFavoritesElement.addEventListener('click', (event) => {
    favoriteButtonPressed(event, movie)
  })

  const titleFavorite = document.createElement('span')
  titleFavorite.textContent = "Favoritar"

  favoritesElement.appendChild(imgFavoritesElement)
  favoritesElement.appendChild(titleFavorite)
  ratingFavorites.appendChild(favoritesElement)

  movieTitle.appendChild(ratingFavorites)
  movieElement.appendChild(movieTitle)

  // description
  const descriptionElement = document.createElement('div')
  descriptionElement.classList.add('description')

  const tagP = document.createElement('p')
  tagP.textContent = overview

  descriptionElement.appendChild(tagP)
  movieElement.appendChild(descriptionElement)
}
