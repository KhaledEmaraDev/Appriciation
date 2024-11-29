import React, { useMemo } from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import Button from "./Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Rating from "@material-ui/lab/Rating";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/styles";

import { useStateValue } from "../store";
import { fillForm, setDialog } from "../actions";

const useStyles = makeStyles(theme => ({
  card: {
    display: "flex"
  },
  details: {
    display: "flex",
    flexDirection: "column"
  },
  content: {
    flex: "1 0 auto"
  },
  cover: {
    width: theme.spacing(20),
    objectFit: "scale-down"
  },
  controls: {
    display: "flex",
    alignItems: "center",
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  }
}));

function ReviewButton(props) {
  const { brand, product } = props;

  // eslint-disable-next-line no-empty-pattern
  const [{}, dispatch] = useStateValue();

  return useMemo(() => {
    function handleReviewClick() {
      dispatch(fillForm("review", "brand", brand));
      dispatch(fillForm("review", "product", product));
      dispatch(fillForm("review", "ratings_buckets", null));
      dispatch(fillForm("review", "min_date", null));
      dispatch(setDialog("review"));
    }

    return (
      <Button color="red" onClick={handleReviewClick}>
        راجع الاَن
      </Button>
    );
  }, [brand, dispatch, product]);
}

export default function ProductOverview(props) {
  const classes = useStyles();
  const { brand, product, rating, imageExists } = props;

  return (
    <React.Fragment>
      <Card className={classes.card} elevation={25}>
        {imageExists && (
          <React.Fragment>
            <Head>
              <meta
                property="og:image"
                content={`https://d3tygoy974vfbk.cloudfront.net/images/apps/${encodeURIComponent(
                  `${brand} ${product}`
                )}.jpg`}
              />
            </Head>
            <CardMedia
              component="img"
              className={classes.cover}
              image={`https://d3tygoy974vfbk.cloudfront.net/images/apps/${encodeURIComponent(
                `${brand} ${product}`
              )}.jpg`}
              loading="auto"
              title={`${brand} ${product}`}
            />
          </React.Fragment>
        )}
        <div className={classes.details}>
          <CardContent className={classes.content}>
            <Typography component="h1" variant="h5">
              {`${brand} ${product}`}
            </Typography>
            <Rating value={rating} readOnly />
          </CardContent>
          <div className={classes.controls}>
            <ReviewButton brand={brand} product={product} />
          </div>
        </div>
      </Card>
    </React.Fragment>
  );
}

ProductOverview.propTypes = {
  brand: PropTypes.string.isRequired,
  product: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  imageExists: PropTypes.bool.isRequired
};
