import React, { forwardRef } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import AccountCircleTwoTone from "@material-ui/icons/AccountCircleTwoTone";
import Avatar from "@material-ui/core/Avatar";
import Collapse from "@material-ui/core/Collapse";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Link from "./Link";
import List from "./VirtualList";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import Rating from "@material-ui/lab/Rating";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/styles";

import { formatDistance } from "date-fns";
import arLocale from "date-fns/locale/ar-SA";

const useStyles = makeStyles(theme => ({
  block: { display: "block" },
  iconAvatar: {
    fontSize: 48
  },
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  title: {
    fontWeight: 500
  },
  rating: { position: "relative", bottom: theme.spacing(1) },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  subtitle: {
    position: "relative",
    bottom: props => theme.spacing(props.review.ratings ? 1.75 : 0.75)
  },
  heading: {
    fontSize: theme.typography.pxToRem(theme.typography.fontSize * 1.125),
    fontWeight: 700
  },
  productLink: {
    textDecorationLine: "underline"
  },
  center: {
    textAlign: "center"
  }
}));

function ReviewRatings(props) {
  return Object.entries(props.ratings).map(([key, value]) => {
    return (
      <React.Fragment key={key}>
        <Grid item xs={6} sm={3}>
          <Typography variant="subtitle2">{key}:</Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Rating value={value} readOnly />
        </Grid>
      </React.Fragment>
    );
  });
}

const Review = forwardRef(function Review(props, ref) {
  const classes = useStyles(props);
  const [expanded, setExpanded] = React.useState(false);
  const { brand, product, review } = props;

  return (
    <ListItem
      alignItems="flex-start"
      button
      ref={ref}
      onClick={() => setExpanded(!expanded)}
    >
      <ListItemAvatar>
        {review.avatar ? (
          <Avatar alt={review.name} src={review.avatar} />
        ) : (
          <AccountCircleTwoTone className={classes.iconAvatar} />
        )}
      </ListItemAvatar>
      <ListItemText disableTypography>
        <React.Fragment>
          <div className={classes.headerContainer}>
            <div>
              <Typography
                className={clsx(classes.block, classes.title)}
                component="span"
                variant="subtitle1"
                color="textPrimary"
              >
                {review.name ? review.name : "مجهول"}
              </Typography>
              {review.ratings && (
                <Rating
                  className={classes.rating}
                  size="small"
                  value={review.rating}
                  readOnly
                />
              )}
            </div>
            {review.ratings && (
              <div>
                <IconButton
                  edge="end"
                  className={clsx(classes.expand, {
                    [classes.expandOpen]: expanded
                  })}
                  aria-expanded={expanded}
                  aria-label="show more"
                >
                  <ExpandMoreIcon />
                </IconButton>
              </div>
            )}
          </div>
          {review.date_buy && (
            <Typography
              className={clsx(classes.block, classes.subtitle)}
              component="span"
              variant="body2"
              color="textSecondary"
            >
              امتلك لفترة{" "}
              {formatDistance(new Date(), new Date(review.date_buy), {
                locale: arLocale
              })}
            </Typography>
          )}
          <Typography
            className={clsx(classes.block, classes.subtitle)}
            component="span"
            variant="body2"
            color="textSecondary"
          >
            راجع {new Date(review.date_rev).toLocaleDateString()}
          </Typography>
          {review.ratings && (
            <Collapse in={expanded}>
              <Grid container>
                <ReviewRatings ratings={review.ratings} />
              </Grid>
              <br />
            </Collapse>
          )}
          <Typography
            className={classes.heading}
            component="h1"
            variant="h6"
            color="textPrimary"
          >
            مميزات التطبيق{" "}
            {brand ? (
              `${brand} ${product}`
            ) : (
              <Link
                className={classes.productLink}
                color="inherit"
                href={`/reviews?brand=${encodeURIComponent(
                  review.brand
                )}&product=${encodeURIComponent(review.product)}`}
                as={`/reviews/${encodeURIComponent(
                  review.brand
                )}/${encodeURIComponent(review.product)}`}
                prefetch={false}
              >
                {`${review.brand} ${review.product}`}
              </Link>
            )}
          </Typography>
          <Typography variant="body1" color="textPrimary">
            {review.pros}
          </Typography>
          <br />
          <Typography
            className={classes.heading}
            component="h1"
            variant="h6"
            color="textPrimary"
          >
            عيوب التطبيق{" "}
            {brand ? (
              `${brand} ${product}`
            ) : (
              <Link
                className={classes.productLink}
                color="inherit"
                href={`/reviews?brand=${encodeURIComponent(
                  review.brand
                )}&product=${encodeURIComponent(review.product)}`}
                as={`/reviews/${encodeURIComponent(
                  review.brand
                )}/${encodeURIComponent(review.product)}`}
                prefetch={false}
              >
                {`${review.brand} ${review.product}`}
              </Link>
            )}
          </Typography>
          <Typography variant="body1" color="textPrimary">
            {review.cons}
          </Typography>
        </React.Fragment>
      </ListItemText>
    </ListItem>
  );
});

Review.propTypes = {
  brand: PropTypes.string,
  product: PropTypes.string,
  review: PropTypes.object.isRequired
};

const useProductReviewsStyles = makeStyles(theme => ({
  subheader: {
    color: theme.palette.text.secondary,
    fontSize: theme.typography.pxToRem(theme.typography.fontSize),
    boxSizing: "border-box",
    fontFamily: theme.typography.fontFamily,
    fontWeight: 500,
    lineHeight: 1.5,
    padding: theme.spacing(1.25, 1.75)
  }
}));

export default function ProductReviews(props) {
  const classes = useProductReviewsStyles();
  const { title, brand, product, reviews } = props;

  return (
    <Paper elevation={25}>
      <Typography
        className={classes.subheader}
        component="h1"
        variant="subtitle2"
      >
        {title}
      </Typography>
      <List
        containerHeight={400}
        itemCount={reviews.length}
        estimatedItemHeight={200}
      >
        {index => (
          <Review brand={brand} product={product} review={reviews[index]} />
        )}
      </List>
    </Paper>
  );
}

ProductReviews.propTypes = {
  title: PropTypes.string,
  brand: PropTypes.string,
  product: PropTypes.string,
  reviews: PropTypes.array
};
