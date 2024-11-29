/* eslint-disable no-unused-vars */
const fs = require("fs");

let products = JSON.parse(
  fs.readFileSync("products.json", { encoding: "utf8" })
);
let specs = JSON.parse(fs.readFileSync("specs.json", { encoding: "utf8" }));

specs.sort((a, b) => {
  const productA = `${a.brand} ${a.product}`;
  const productB = `${b.brand} ${b.product}`;
  return productA < productB ? -1 : productA > productB ? 1 : 0;
});

const binarySearch = (arr, searchedProduct, start, end) => {
  if (start > end) return false;
  const mid = Math.floor((start + end) / 2);
  const product = `${arr[mid].brand} ${arr[mid].product}`;
  if (product === searchedProduct) return arr[mid];
  if (product > searchedProduct)
    return binarySearch(arr, searchedProduct, start, mid - 1);
  else return binarySearch(arr, searchedProduct, mid + 1, end);
};

products = products.map(product => {
  const spec = binarySearch(
    specs,
    `${product.brand} ${product.product}`,
    0,
    specs.length - 1
  );

  const {
    brand: _tmp1,
    product: _tmp2,
    thumbnail: _tmp3,
    publish_date,
    ...rest
  } = spec;

  const newSpec = {
    publish_date: new Date(publish_date),
    ...rest
  };

  const returnedProduct = {
    ...product,
    ratings_buckets: [
      "جودة التصنيع",
      "واجهة المستخدم",
      "القيمة للسعر",
      "الكاميرا",
      "جودة المكالمات",
      "البطارية"
    ]
  };

  if (spec) returnedProduct.specs = newSpec;

  return returnedProduct;
});

const MongoClient = require("mongodb").MongoClient;

const user = encodeURIComponent(process.env.DB_USER);
const password = encodeURIComponent(process.env.DB_PASSWORD);
const dbName = "appriciation";
const url = `mongodb://${user}:${password}@appriciation.com:27017/?authMechanism=SCRAM-SHA-1&authSource=${dbName}`;

MongoClient.connect(
  url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  function(err, client) {
    if (err) return console.log(err);

    const db = client.db(dbName);
    const collection = db.collection("products");

    collection.insertMany(products, function(err, result) {
      if (err) console.log(err);
      else
        console.log(
          `Inserted ${result.insertedCount} documents into the collection.`
        );
    });
  }
);
