import React, { useState, useCallback, useEffect } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import RenderMovie from './Movie';
import { makeStyles } from '@material-ui/core/styles';
import debounce from 'lodash/debounce';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  formControl: {
    margin: theme.spacing(1),
  },
  controls: {
    marginBottom: theme.spacing(3),
  },
  poster: {
    height: 100
  }
}));

function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [year, setYear] = useState('');
  const [type, setType] = useState('movie');
  const [movieData, setMovieData] = useState({ movies: [] });
  const classes = useStyles();

  let newMoviedata = { movies: [] };

  // see https://dev.to/reflexgravity/use-lodash-debouce-inside-a-functional-component-in-react-4g5j
  // for the debounce example
  const updateQuery = (page = 1, newQuery = false) => {
    // A search query api call.
    if (searchTerm) {
      console.log('API request triggered for ' + searchTerm);
      axios.get(`http://localhost:8970/api/search?t=${searchTerm}&y=${year}&type=${type}&page=${page}`, {
        auth: {
          username: localStorage.getItem('username'),
          password: localStorage.getItem('password')
        }
      })
        .then(({ data }) => {
          console.log('axios:get', data);
          if (data && data.Search) {
            setMovieData(oldData => {
              newMoviedata = {
                ...oldData,
                ...data,
                movies: newQuery ? data.Search : [...oldData.movies, ...data.Search]
              };
              return newMoviedata;
            });
          } else {
            setMovieData({ movies: [] });
          }
        });
    }
  };

  const delayedQuery = useCallback(debounce(() => updateQuery(1, true), 300), [searchTerm, year, type]);

  function handleScroll() {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
    if (newMoviedata.nextPage) {
      console.log('Fetch more list items!', newMoviedata);
      updateQuery(newMoviedata.nextPage, false);
    }
  }

  useEffect(() => {
    delayedQuery();
    window.addEventListener('scroll', handleScroll);

    return () => {
      // Cancel the debounce on useEffect cleanup.
      delayedQuery.cancel();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [searchTerm, year, type, delayedQuery]);

  const onTypeChangeHandler = e => setType(e.target.value);
  const onYearChangeHandler = e => setYear(e.target.value);
  const onSearchTermChangeHandler = e => setSearchTerm(e.target.value);

  return (
    <Container component="main">
      <CssBaseline />
      <div className={classes.paper}>
        <div className={classes.controls}>
          <FormControl className={classes.formControl}>
            <TextField
              fullWidth
              color="secondary"
              type="search"
              id="search_term"
              label="Type in to search by title"
              name="search_term"
              autoComplete="search_term"
              autoFocus
              value={searchTerm}
              onChange={onSearchTermChangeHandler}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel shrink id="year">
              Year
            </InputLabel>
            <Select
              labelId="year"
              value={year}
              color="secondary"
              onChange={onYearChangeHandler}
            >
              {Array.from({length: 122}, (v, i) => 1900 + i).map(year => <MenuItem key={year} value={year}>{year}</MenuItem>)}
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel shrink id="type">
              Type
            </InputLabel>
            <Select
              labelId="type"
              value={type}
              onChange={onTypeChangeHandler}
              color="secondary"
            >
              <MenuItem value="movie">Movie</MenuItem>
              <MenuItem value="series">Series</MenuItem>
              <MenuItem value="episode">Episode</MenuItem>
            </Select>
          </FormControl>
        </div>

        <Container maxWidth="sm">
          {
            movieData.movies && movieData.movies.length
              ? movieData.movies.map((movie, i) => 
                <RenderMovie key={`${movie.imdbID}_${i}`} movie={movie} />)
              : <p style={{ textAlign: 'center' }}><i>Nothing found</i></p>
          }
        </Container>
      </div>
    </Container>
  );
}

export default Search;
