import jwt from "jsonwebtoken";
import Cors from "micro-cors";
import withFirebase from "../../../../middlewares/withFirebase";

const cors = Cors({
  allowedMethods: ["HEAD", "OPTIONS", "POST"]
});

const handler = (req, res) => {
  const { firebase, body, method } = req;

  switch (method) {
    case "POST": {
      if (!body) return res.sendStatus(400);

      const token = req.body.token;

      firebase
        .auth()
        .verifyIdToken(token)
        .then(decodedToken => {
          req.session.decodedToken = decodedToken;
          const newToken = {
            id: decodedToken.uid
          };
          if (decodedToken.name) newToken.name = decodedToken.name;
          if (decodedToken.picture) newToken.picture = decodedToken.picture;
          if (decodedToken.email) {
            newToken.email = decodedToken.email;
            if (!newToken.name) newToken.username = decodedToken.email;
          }
          jwt.sign(
            newToken,
            process.env.SESSION_SECRET,
            // { algorithm: "RS256" },
            (error, token) => {
              if (error) {
                console.log(error);
                return res.json({ error });
              }
              res.cookie("token", token, {
                domain: ".appriciation.com",
                httpOnly: true,
                maxgAge: 7 * 24 * 60 * 60 * 1000
              });
              res.json({ status: true, decodedToken });
            },
            { expiresIn: 2 * 7 * 24 * 60 * 60 }
          );
        })
        .catch(error => {
          console.log(error);
          res.json({ error });
        });
      break;
    }
    case "HEAD":
    case "OPTIONS":
      res.send(res, 200, "ok!");
      break;
    default:
      res.setHeader("Allow", ["HEAD", "OPTIONS", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default cors(withFirebase(handler));
