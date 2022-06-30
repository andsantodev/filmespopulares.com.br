// import { apikey } from "../js/apikey.js" 
import apikey from "../js/apikey.js"

async function getPopularMovies() {
  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apikey}`
  const response = await fetch(url)
  const { results } = await response.json()
  return results
}

async function getSearchMovie(title) {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apikey}&query=${title}`
  const response = await fetch(url)
  const { results } = await response.json()
  return results
}

export const API = {
  getPopularMovies,
  getSearchMovie
}