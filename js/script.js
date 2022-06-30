import { API } from "../services/api.js"
import { LocalStorage } from "../services/localStorage.js"

const moviesList = document.querySelector('#movies-list')
const input = document.querySelector('[name="search-movie"]')
const searchButton = document.querySelector('.icon-search')
const checkboxInput = document.querySelector('input[type="checkbox"]')
checkboxInput.addEventListener('change', checkCheckboxStatus)
searchButton.addEventListener('click', searchMovie)

input.addEventListener('keyup', function(event){
  if (event.keyCode == 13) {
    searchMovie()
    return
  }
})

// checkbox status
function checkCheckboxStatus() {
  const isChecked = checkboxInput.checked
  if (isChecked) {
    cleanAllMovies()
    const movies = LocalStorage.getFavoriteMovies() || []
    movies.forEach(movie => createMovie(movie))
  } else {
    cleanAllMovies()
    getAllPopularMovies()
  }
}

// search movie
async function searchMovie() {
  const inputValue = input.value
  let movies;
  if (inputValue != '') {
    cleanAllMovies()
    movies = await API.getSearchMovie(inputValue)
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

// button favorite movie
function favoriteButtonPressed(event, movie) {
  const favoriteState = {
    favorited: 'images/heart-full.svg',
    notFavorited: 'images/heart.svg'
  }
  if (event.target.src.includes(favoriteState.notFavorited)) {
    event.target.src = favoriteState.favorited
    LocalStorage.saveToLocalStorage(movie)
  } else {
    event.target.src = favoriteState.notFavorited
    LocalStorage.removeFromLocalStorage(movie.id)
  }
}

// all movies
async function getAllPopularMovies() {
  const movies = await API.getPopularMovies()
  movies.forEach(movie => createMovie(movie))
}

// load
window.onload = function () {
  getAllPopularMovies()
}

// create movie
const createMovie = (movie) =>{ 
  const {id, poster_path, title, release_date, vote_average, overview} = movie
  const isFavorited = LocalStorage.checkMovieIsFavorited(id)

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
