import { MongoClient } from "mongodb";

const user = encodeURIComponent(process.env.DB_USER);
const password = encodeURIComponent(process.env.DB_PASSWORD);
const authMechanism = "SCRAM-SHA-1";
const dbName = "appriciation";

const url = `mongodb://${user}:${password}@${process.env.DB_HOST}/?authMechanism=${authMechanism}&authSource=${dbName}`;

const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const withDatabase = handler => (req, res) => {
  if (!client.isConnected()) {
    return client.connect().then(() => {
      req.db = client.db(dbName);
      return handler(req, res);
    });
  }
  req.db = client.db(dbName);
  return handler(req, res);
};

export default withDatabase;
