import React from "react";
import PropTypes from "prop-types";
import ButtonBase from "@material-ui/core/ButtonBase";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import Link from "./Link";
import MobileStepper from "@material-ui/core/MobileStepper";
import Paper from "@material-ui/core/Paper";
import SwipeableViews from "react-swipeable-views";
import Typography from "@material-ui/core/Typography";
import { autoPlay } from "react-swipeable-views-utils";
import { makeStyles, useTheme } from "@material-ui/styles";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const useStyles = makeStyles(theme => ({
  container: { position: "relative" },
  subheader: {
    color: theme.palette.text.secondary,
    fontSize: theme.typography.pxToRem(theme.typography.fontSize),
    boxSizing: "border-box",
    fontFamily: theme.typography.fontFamily,
    fontWeight: 500,
    lineHeight: 1.5,
    padding: theme.spacing(1.25, 1.75)
  },
  img: {
    borderRadius: theme.shape.borderRadius,
    width: "100%",
    overflow: "hidden"
  },
  containerBackground: {
    position: "absolute",
    borderRadius: theme.shape.borderRadius,
    background: "rgba(0, 0, 0, 0.5)",
    width: "100%",
    bottom: 0
  },
  link: {
    color: "white",
    textDecoration: "underline"
  },
  title: {
    fontSize: theme.typography.pxToRem(theme.typography.fontSize * 1.5)
  },
  stepper: { background: "rgba(0, 0, 0, 0)" },
  stepperDot: { backgroundColor: "rgba(255, 255, 255, 0.54)" },
  stepperDotActive: { backgroundColor: theme.palette.primary.main },
  iconButtonRoot: { color: "rgba(255, 255, 255, 0.54)" },
  iconButtonDisabled: { color: "rgba(255, 255, 255, 0.26)" }
}));

export default function Carousel(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = props.slides.length;

  function handleNext() {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  }

  function handleBack() {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  }

  function handleStepChange(step) {
    setActiveStep(step);
  }

  return (
    <Paper elevation={25} className={classes.container}>
      <Typography className={classes.subheader} component="h1">
        {props.title}
      </Typography>
      <AutoPlaySwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
      >
        {props.slides.map((step, index) => (
          <div key={`${step.brand} ${step.product}`}>
            {Math.abs(activeStep - index) <= 2 ? (
              <ButtonBase
                className={classes.img}
                component={Link}
                naked
                href={`/reviews?brand=${encodeURIComponent(
                  step.brand
                )}&product=${encodeURIComponent(step.product)}`}
                as={`/reviews/${encodeURIComponent(
                  step.brand
                )}/${encodeURIComponent(step.product)}`}
              >
                <img
                  loading="auto"
                  className={classes.img}
                  src={`https://d3tygoy974vfbk.cloudfront.net/images/apps/${encodeURIComponent(
                    `${step.brand} ${step.product}`
                  )}.jpg`}
                  alt={`${step.brand} ${step.product}`}
                />
              </ButtonBase>
            ) : null}
          </div>
        ))}
      </AutoPlaySwipeableViews>
      <div className={classes.containerBackground}>
        <Link
          className={classes.link}
          href={`/reviews?brand=${encodeURIComponent(
            props.slides[activeStep].brand
          )}&product=${encodeURIComponent(props.slides[activeStep].product)}`}
          as={`/reviews/${encodeURIComponent(
            props.slides[activeStep].brand
          )}/${encodeURIComponent(props.slides[activeStep].product)}`}
        >
          <Typography
            className={classes.title}
            variant="overline"
            component="h2"
            align="center"
          >
            {`${props.slides[activeStep].brand} ${props.slides[activeStep].product}`}
          </Typography>
        </Link>
        <MobileStepper
          position="static"
          className={classes.stepper}
          classes={{
            dot: classes.stepperDot,
            dotActive: classes.stepperDotActive
          }}
          steps={maxSteps}
          variant="dots"
          activeStep={activeStep}
          nextButton={
            <IconButton
              size="small"
              onClick={handleNext}
              disabled={activeStep === maxSteps - 1}
              classes={{
                root: classes.iconButtonRoot,
                disabled: classes.iconButtonDisabled
              }}
            >
              <KeyboardArrowLeft />
            </IconButton>
          }
          backButton={
            <IconButton
              size="small"
              onClick={handleBack}
              disabled={activeStep === 0}
              classes={{
                root: classes.iconButtonRoot,
                disabled: classes.iconButtonDisabled
              }}
            >
              <KeyboardArrowRight />
            </IconButton>
          }
        />
      </div>
    </Paper>
  );
}

Carousel.propTypes = {
  title: PropTypes.string.isRequired,
  slides: PropTypes.array.isRequired
};
