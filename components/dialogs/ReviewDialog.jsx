import React, { useEffect, useState } from "react";
import clsx from "clsx";
import fetch from "../../fetch";
import PropTypes from "prop-types";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CheckIcon from "@material-ui/icons/Check";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import RateReviewOutlinedIcon from "@material-ui/icons/RateReviewOutlined";
import Rating from "@material-ui/lab/Rating";
import SearchBar from "../SearchBar";
import Skeleton from "@material-ui/lab/Skeleton";
import Step from "@material-ui/core/Step";
import StepConnector from "@material-ui/core/StepConnector";
import StepLabel from "@material-ui/core/StepLabel";
import Stepper from "@material-ui/core/Stepper";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { DatePicker } from "@material-ui/pickers";
import { makeStyles, withStyles } from "@material-ui/styles";

import { useStateValue } from "../../store";
import { fillForm, setDialog, showSnackbar } from "../../actions";

import * as gtag from "../../lib/gtag";

const QontoConnector = withStyles(theme => ({
  alternativeLabel: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)"
  },
  active: {
    "& $line": {
      borderColor: theme.palette.primary.main
    }
  },
  completed: {
    "& $line": {
      borderColor: theme.palette.primary.main
    }
  },
  line: {
    borderColor: "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1
  }
}))(StepConnector);

const useQontoStepIconStyles = makeStyles(theme => ({
  root: {
    color: "#eaeaf0",
    display: "flex",
    height: 22,
    alignItems: "center"
  },
  active: {
    color: theme.palette.primary.main
  },
  circle: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "currentColor"
  },
  completed: {
    color: theme.palette.primary.main,
    zIndex: 1,
    fontSize: 18
  }
}));

function QontoStepIcon(props) {
  const classes = useQontoStepIconStyles();
  const { active, completed, handleReset } = props;

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active
      })}
    >
      {completed ? (
        <IconButton onClick={handleReset}>
          <CheckIcon className={classes.completed} />
        </IconButton>
      ) : (
        <div className={classes.circle} />
      )}
    </div>
  );
}

QontoStepIcon.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool,
  handleReset: PropTypes.func
};

const useStyles = makeStyles(theme => ({
  paper: {
    margin: theme.spacing(2, 0, 2, 0),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundImage: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)"
  },
  stepper: { width: "100%" },
  form: {
    width: "100%" // Fix IE 11 issue.
  },
  title: {
    width: "100%",
    display: "inline-block",
    fontSize: 14,
    fontWeight: 500
  },
  submit: {
    margin: theme.spacing(2, 0)
  },
  brandContainer: {
    marginTop: theme.spacing(2)
  },
  center: {
    textAlign: "center"
  },
  error: {
    color: theme.palette.error.main
  }
}));

function getSteps() {
  return ["اختر المنتج", "راجع المنتج"];
}

export default function ReviewDialog() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [loading, setLoading] = useState(false);

  const [
    {
      user,
      forms: { review }
    },
    dispatch
  ] = useStateValue();

  const steps = getSteps();

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    dispatch(fillForm("review", "brand", null));
    dispatch(fillForm("review", "product", null));
    dispatch(fillForm("review", "ratings_buckets", null));
    dispatch(fillForm("review", "min_date", null));
  };

  useEffect(() => {
    if (review.product) handleNext();
    else return;
    if (review.ratings_buckets) return;
    setLoading(true);
    fetch(
      `/api/pages/dialogs/review?brand=${encodeURIComponent(
        review.brand
      )}&product=${encodeURIComponent(review.product)}`
    )
      .then(res => res.json())
      .then(result => {
        dispatch(
          fillForm(
            "review",
            "min_date",
            result.specs ? result.specs.publish_date : null
          )
        );
        dispatch(fillForm("review", "ratings_buckets", result.ratings_buckets));
        setLoading(false);
      });
  }, [dispatch, review.brand, review.product, review.ratings_buckets]);

  function handleProductSelected(suggestion) {
    dispatch(fillForm("review", "brand", suggestion.brand));
    dispatch(fillForm("review", "product", suggestion.product));
  }

  function handleDateBuyChanged(date) {
    dispatch(fillForm("review", "date_buy", date));
  }

  function handleTextChage(name) {
    return function(event) {
      dispatch(fillForm("review", name, event.target.value));
    };
  }

  function handleOverallRatingChanged(event, newValue) {
    dispatch(fillForm("review", "rating", newValue));
  }

  function handleRatingChanged(bucket) {
    return function(event, newValue) {
      dispatch(
        fillForm("review", "ratings", { ...review.ratings, [bucket]: newValue })
      );
    };
  }

  function handleBrandRatingChanged(event, newValue) {
    dispatch(fillForm("review", "brand_rating", newValue));
  }

  function invalidateForm() {
    dispatch(fillForm("review", "dirty", true));
  }

  function handleSubmit() {
    const {
      brand,
      product,
      date_buy,
      rating,
      pros,
      cons,
      ratings,
      brand_rating,
      brand_pros,
      brand_cons,
      ratings_buckets,
      min_date
    } = review;

    if (!product)
      return dispatch(showSnackbar("warning", "عليك باختيار المنتج"));

    if (date_buy <= (min_date ? min_date : new Date("2008-01"))) {
      invalidateForm();
      return dispatch(
        showSnackbar("warning", "عليك باختيار تاريخ تنزيل التطبيق")
      );
    }

    if (!pros || !cons || !brand_pros || !brand_cons) {
      invalidateForm();
      return dispatch(showSnackbar("warning", "عليك بملئ الخانات الاَتية"));
    }

    if (
      !rating ||
      !brand_rating ||
      Object.keys(ratings).length != ratings_buckets.length
    ) {
      invalidateForm();
      return dispatch(showSnackbar("warning", "عليك بتقيم المنتج"));
    }

    if (!user) return dispatch(setDialog("sign-up-prompt"));

    gtag.event({
      action: "submit_form",
      category: "review",
      label: `${brand} ${product}`
    });

    fetch("/api/review", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      credentials: "same-origin",
      body: JSON.stringify({
        review: {
          brand,
          product,
          date_buy,
          rating,
          pros,
          cons,
          ratings,
          brand_rating,
          brand_pros,
          brand_cons
        }
      })
    })
      .then(res => {
        if (!res.ok) throw new Error("حدث خطأ في الاتصال");
        return res.json();
      })
      .then(result => {
        dispatch(setDialog(null));
        dispatch(
          showSnackbar(result.status ? "success" : "error", result.message)
        );
      })
      .catch(err => {
        dispatch(setDialog(null));
        dispatch(showSnackbar("error", err.message));
      });
  }

  const dateError = review.dirty && review.date_buy <= new Date("2008-01");
  const ratingError = review.dirty && !review.rating;
  const prosError = review.dirty && !review.pros;
  const consError = review.dirty && !review.cons;
  const brand_prosError = review.dirty && !review.brand_pros;
  const brand_consError = review.dirty && !review.brand_cons;
  const ratingsErrors =
    review.dirty &&
    Object.assign(
      {},
      ...review.ratings_buckets.map(bucket => ({
        [bucket]: !(bucket in review.ratings)
      }))
    );
  const brand_ratingError = review.dirty && !review.brand_rating;

  return (
    <Container maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <RateReviewOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          راجع الاَن
        </Typography>
        <Stepper
          className={classes.stepper}
          alternativeLabel
          activeStep={activeStep}
          connector={<QontoConnector />}
        >
          {steps.map(label => (
            <Step key={label}>
              <StepLabel
                StepIconComponent={QontoStepIcon}
                StepIconProps={{ handleReset }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <Grid className={classes.form} container spacing={2}>
          <Grid item xs={12}>
            {review.product ? (
              <Typography
                className={classes.title}
                variant="overline"
                align="center"
              >{`${review.brand} ${review.product}`}</Typography>
            ) : (
              <SearchBar
                id="review-product-search"
                placeholder="ابحث عن منتج"
                handleSuggestionSelected={handleProductSelected}
              />
            )}
          </Grid>
          <Grid item xs={12}>
            <DatePicker
              id="review-date-picker"
              fullWidth
              views={["year", "month"]}
              label="منذ متى و أنت تستخدم التطبيق"
              okLabel="موافق"
              cancelLabel="الغاء"
              error={dateError}
              minDate={review.min_date ? review.min_date : new Date("2008-01")}
              minDateMessage="برجاء اختر تاريخ تنزيل التطبيق"
              disableFuture
              value={review.date_buy}
              onChange={handleDateBuyChanged}
              allowKeyboardControl={false}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography
              className={clsx({
                [classes.error]: ratingError
              })}
              variant="subtitle2"
              align="center"
            >
              قيم تجربتك العامة مع التطبيق
            </Typography>
          </Grid>
          <Grid className={classes.center} item xs={12}>
            <Rating
              value={review.rating}
              name="rating"
              onChange={handleOverallRatingChanged}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              multiline
              error={prosError}
              label="ماذا يعجبك بشأن التطبيق"
              value={review.pros}
              onChange={handleTextChage("pros")}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              multiline
              error={consError}
              label="ما الذي تكرهه بشأن هذا التطبيق"
              value={review.cons}
              onChange={handleTextChage("cons")}
            />
          </Grid>
          {loading &&
            [0, 1, 2, 3, 4, 5].map(value => (
              <React.Fragment key={value}>
                <Grid item xs={6}>
                  <Skeleton height={12} />
                </Grid>
                <Grid item xs={6}>
                  <Skeleton height={12} />
                </Grid>
              </React.Fragment>
            ))}
          {review.ratings_buckets &&
            review.ratings_buckets.map(bucket => (
              <React.Fragment key={bucket}>
                <Grid item xs={6}>
                  <Typography
                    className={clsx({
                      [classes.error]: ratingsErrors && ratingsErrors[bucket]
                    })}
                    variant="subtitle2"
                    align="center"
                  >
                    {bucket}:
                  </Typography>
                </Grid>
                <Grid className={classes.center} item xs={6}>
                  <Rating
                    value={review.ratings[bucket]}
                    name={`rating${bucket}`}
                    onChange={handleRatingChanged(bucket)}
                  />
                </Grid>
              </React.Fragment>
            ))}
          {review.brand && (
            <React.Fragment>
              <Grid className={classes.brandContainer} item xs={12}>
                <Typography
                  className={clsx({
                    [classes.error]: brand_ratingError
                  })}
                  variant="subtitle2"
                  align="center"
                >{`كيف تقيم ${review.brand}؟`}</Typography>
              </Grid>
              <Grid className={classes.center} item xs={12}>
                <Rating
                  value={review.brand_rating}
                  name="brand_rating"
                  onChange={handleBrandRatingChanged}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  multiline
                  error={brand_prosError}
                  label={`ماذا يعجبك بشأن ${review.brand}؟`}
                  value={review.brand_pros}
                  onChange={handleTextChage("brand_pros")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  multiline
                  error={brand_consError}
                  label={`ما الذي تكرهه بشأن ${review.brand}؟`}
                  value={review.brand_cons}
                  onChange={handleTextChage("brand_cons")}
                />
              </Grid>
            </React.Fragment>
          )}
        </Grid>
        <Button
          fullWidth
          variant="outlined"
          color="primary"
          className={classes.submit}
          onClick={handleSubmit}
        >
          انشر الاَن
        </Button>
      </div>
    </Container>
  );
}

ReviewDialog.propTypes = {
  brand: PropTypes.string,
  product: PropTypes.string
};
