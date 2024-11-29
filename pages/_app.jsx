import React from "react";
import PropTypes from "prop-types";
import Router from "next/router";
import App from "next/app";
import Head from "next/head";
import { create } from "jss";
import rtl from "jss-rtl";
import theme from "../theme";
import CssBaseline from "@material-ui/core/CssBaseline";
import MainNav from "../components/MainNav";
import NProgress from "nprogress";
import {
  ThemeProvider,
  StylesProvider,
  jssPreset,
  withStyles
} from "@material-ui/styles";

import arLocale from "date-fns/locale/ar-SA";
import DateFnsUtils from "@date-io/date-fns";
import format from "date-fns/format";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";

import { StateProvider } from "../store";
import { reducer, initialState } from "../reducer";

import * as gtag from "../lib/gtag";

Router.events.on("routeChangeStart", () => {
  NProgress.start();
});
Router.events.on("routeChangeComplete", url => {
  gtag.pageview(url);
  NProgress.done();
});
Router.events.on("routeChangeError", () => NProgress.done());

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

/* eslint-disable no-dupe-keys */

const styles = {
  "@font-face": [
    {
      fontFamily: '"Tajawal"',
      fontStyle: "normal",
      fontWeight: 300,
      fontDisplay: "swap",
      src:
        'local("Tajawal Light"), local("Tajawal-Light"), url(/fonts/tajawal-arabic-300.woff2) format("woff2"); unicode-range: U+0600-06FF, U+200C-200E, U+2010-2011, U+204F, U+2E41, U+FB50-FDFF, U+FE80-FEFC'
    },
    {
      fontFamily: '"Tajawal"',
      fontStyle: "normal",
      fontWeight: 300,
      fontDisplay: "swap",
      src:
        'local("Tajawal Light"), local("Tajawal-Light"), url(/fonts/tajawal-latin-300.woff2) format("woff2"); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD'
    },
    {
      fontFamily: '"Tajawal"',
      fontStyle: "normal",
      fontWeight: 400,
      fontDisplay: "swap",
      src:
        'local("Tajawal"), local("Tajawal-Regular"), url(/fonts/tajawal-arabic-400.woff2) format("woff2"); unicode-range: U+0600-06FF, U+200C-200E, U+2010-2011, U+204F, U+2E41, U+FB50-FDFF, U+FE80-FEFC'
    },
    {
      fontFamily: '"Tajawal"',
      fontStyle: "normal",
      fontWeight: 400,
      fontDisplay: "swap",
      src:
        'local("Tajawal"), local("Tajawal-Regular"), url(/fonts/tajawal-latin-400.woff2) format("woff2"); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD'
    },
    {
      fontFamily: '"Tajawal"',
      fontStyle: "normal",
      fontWeight: 500,
      fontDisplay: "swap",
      src:
        'local("Tajawal Medium"), local("Tajawal-Medium"), url(/fonts/tajawal-arabic-500.woff2) format("woff2"); unicode-range: U+0600-06FF, U+200C-200E, U+2010-2011, U+204F, U+2E41, U+FB50-FDFF, U+FE80-FEFC'
    },
    {
      fontFamily: '"Tajawal"',
      fontStyle: "normal",
      fontWeight: 500,
      fontDisplay: "swap",
      src:
        'local("Tajawal Medium"), local("Tajawal-Medium"), url(/fonts/tajawal-latin-500.woff2) format("woff2"); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD'
    },
    {
      fontFamily: '"Tajawal"',
      fontStyle: "normal",
      fontWeight: 700,
      fontDisplay: "swap",
      src:
        'local("Tajawal Bold"), local("Tajawal-Bold"), url(/fonts/tajawal-arabic-700.woff2) format("woff2"); unicode-range: U+0600-06FF, U+200C-200E, U+2010-2011, U+204F, U+2E41, U+FB50-FDFF, U+FE80-FEFC'
    },
    {
      fontFamily: '"Tajawal"',
      fontStyle: "normal",
      fontWeight: 700,
      fontDisplay: "swap",
      src:
        'local("Tajawal Bold"), local("Tajawal-Bold"), url(/fonts/tajawal-latin-700.woff2) format("woff2"); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD'
    }
  ],
  "@global": {
    "#nprogress": {
      pointerEvents: "none"
    },
    "#nprogress .bar": {
      background: "#29d",
      position: "fixed",
      zIndex: 2000,
      top: 0,
      left: 0,
      width: "100%",
      height: 2
    },
    "#nprogress .peg": {
      display: "block",
      position: "absolute",
      right: 0,
      width: 100,
      height: "100%",
      boxShadow: "0 0 10px #29d, 0 0 5px #29d",
      opacity: 1,
      "-webkit-transform": "rotate(3deg) translate(0px, -4px)",
      "-ms-transform": "rotate(3deg) translate(0px, -4px)",
      transform: "rotate(3deg) translate(0px, -4px)"
    }
  }
};

class LocalizedUtils extends DateFnsUtils {
  format(date, formatString) {
    if (formatString === "MMM") formatString = "MMMM";
    return format(date, formatString, { locale: this.locale });
  }
}

/* eslint-disable no-dupe-keys */

class MyApp extends App {
  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <React.Fragment>
        <Head>
          <title>استكشاف التطبيقات - Appriciation</title>
          <meta
            name="description"
            content="موقع مخصص لاسكتشاف التطبيقات الجديدة"
          ></meta>
          <meta property="og:title" content="استكشاف التطبيقات - Appriciation" />
          <meta
            property="og:description"
            content="موقع مخصص لاسكتشاف التطبيقات الجديدة"
          />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://appriciation.com" />
          <meta property="og:image" content="/images/favicon.ico" />
          <meta property="fb:app_id" content="429675907831370" />
        </Head>
        <StateProvider initialState={initialState} reducer={reducer}>
          <ThemeProvider theme={theme}>
            <StylesProvider jss={jss}>
              <MuiPickersUtilsProvider utils={LocalizedUtils} locale={arLocale}>
                <CssBaseline />
                <MainNav>
                  <Component {...pageProps} />
                </MainNav>
              </MuiPickersUtilsProvider>
            </StylesProvider>
          </ThemeProvider>
        </StateProvider>
      </React.Fragment>
    );
  }
}

MyApp.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MyApp);
