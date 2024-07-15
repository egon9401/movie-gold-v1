import './App.css';
import api from './api/axiosConfig';
import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/home/Home';
import Header from './components/header/Header';
import Trailer from './components/trailer/Trailer';
import Reviews from './components/reviews/Reviews';
import Login from './components/LoginPage';
import Register from './components/SignupPage';
import Hero from './components/hero/Hero';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [movies, setMovies] = useState(null);
  const [movie, setMovie] = useState();
  const [reviews, setReviews] = useState([]);

  const handleLogin = async (formData) => {
    try {
      console.log('called');
      const response = await api.post('/login', formData);
      console.log('handleLogin: ', response.data);
      setLoggedIn(true);
      getMovies();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
  };

  const getMovies = async () => {
    try {
      const response = await api.get("/api/v1/movies");
      setMovies(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getMovieData = async (movieId) => {
    try {
      const response = await api.get(`/api/v1/movies/${movieId}`);
      const singleMovie = response.data;
      setMovie(singleMovie);
      setReviews(singleMovie.reviews);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      setLoggedIn(true);
      getMovies();
    }

    if (loggedIn) {
      getMovies();
    }
  }, [loggedIn]);

  return (
    <div className="App">
      <Header loggedIn={loggedIn} handleLogout={handleLogout} />
      <Routes>
        {loggedIn ? (
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Home movies={movies} />} />
            <Route path="/Trailer/:ytTrailerId" element={<Trailer />} />
            <Route
              path="/Reviews/:movieId"
              element={<Reviews getMovieData={getMovieData} movie={movie} reviews={reviews} setReviews={setReviews} />}
            />
            <Route path="/home" element={<Home />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        ) : (
          <>
            <Route path="/login" element={<Login handleLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
