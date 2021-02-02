import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: 500,
  },
  img: {
    height: 128,
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
}));

export default function RenderMovie({ movie }) {
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <Grid container spacing={2}>
        <Grid item>
          <img className={classes.img} alt="complex" src={movie.Poster} />
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle1">
                {movie.Title}
              </Typography>
              <Typography variant="body2" gutterBottom>
                IMDb: {movie.imdbID}
              </Typography>
            </Grid>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1">{movie.Year}</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}
