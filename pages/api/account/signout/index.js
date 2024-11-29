import Cors from "micro-cors";

const cors = Cors({
  allowedMethods: ["HEAD", "OPTIONS", "POST"]
});

const handler = (req, res) => {
  const { method } = req;

  switch (method) {
    case "POST": {
      req.session.decodedToken = null;
      res.clearCookie("token", {
        domain: ".appriciation.com",
        httpOnly: true
      });
      res.json({ status: true });
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

export default cors(handler);
