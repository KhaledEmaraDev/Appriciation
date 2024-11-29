import React from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Rating from "@material-ui/lab/Rating";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
  root: { padding: theme.spacing(0, 2) },
  subheader: {
    padding: theme.spacing(2, 0),
    color: theme.palette.text.secondary,
    fontSize: theme.typography.pxToRem(theme.typography.fontSize),
    boxSizing: "border-box",
    fontFamily: theme.typography.fontFamily,
    fontWeight: 500,
    lineHeight: 1.5
  },
  center: {
    textAlign: "center"
  }
}));

export default function ProductRating(props) {
  const classes = useStyles();
  const { brand, product, ratings } = props;

  return (
    <Paper className={classes.root} elevation={25}>
      <Typography
        className={classes.subheader}
        component="h1"
        variant="subtitle2"
      >{`تقييمات تطبيق ${brand} ${product}`}</Typography>
      <Grid container spacing={1}>
        {ratings.map(rating => (
          <React.Fragment key={rating._id}>
            <Grid item xs={6} sm={3}>
              <Typography variant="subtitle2" align="center">
                {rating._id}:
              </Typography>
            </Grid>
            <Grid className={classes.center} item xs={6} sm={3}>
              <Rating value={rating.avg_rating} readOnly />
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
    </Paper>
  );
}

ProductRating.propTypes = {
  brand: PropTypes.string.isRequired,
  product: PropTypes.string.isRequired,
  ratings: PropTypes.array.isRequired
};
