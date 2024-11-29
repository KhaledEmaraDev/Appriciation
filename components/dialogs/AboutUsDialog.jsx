import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Container from "@material-ui/core/Container";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
  paper: {
    margin: theme.spacing(2, 0, 2, 0),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(4)
  }
}));

export default function SignUpPromptDialog() {
  const classes = useStyles();

  return (
    <Container maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          عنا
        </Typography>
        <div className={classes.form}>
          <Typography variant="body1" align="center">
            منصة لاستكشاف التطبيقات
          </Typography>
        </div>
      </div>
    </Container>
  );
}
