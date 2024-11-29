# Appriciation

Appriciation is a server side rendered app discovery platform made using Next.js(React), Express.js and MongoDB.

## Installation

First install the dependencies using your favorite package manager.

```bash
yarn install
```

Then build the project to generate the files necessary to run it.

```bash
yarn build
```

Finally start a server to host and run the app.

```bash
yarn start
```

## Structure

Directory | Function
------------ | -------------
components | Building blocks for pages reside here. Each one is standalone component relying solely on its props.
config | Contains config files for the infrastructure
credentials | Contains server credentials configurations (excluded from source control)
fetch | A universal fetch component for client and server alike. (uses `unfetch` for the client side and `@zeit/fetch` for the server)
git-hooks | Contains git hooks to continuously deliver new versions on every commit.
legacy | Contains the old API build using python atop serverless AWS Lambda Functions.
lib | Contains small self-contained libraries. Mainly provides an API to cache fetch requests and an API to setup Google Analytics.
middleware | Contains server middleware helpers to provide a uniform way of accessing Firebase and the Database.
pages | Contains the React files necessary to build the web app. This is the main entry point of the App. Each page has its own directory in the root. Deeper paths are structured as subdirectories.
pages/_app.jsx | This script is included as a part of every page (contains logic commom to all pages like authentication and the main web app layout).
pages/_document.jsx | This script alters every pages's DOM (contains code necessary to inject server side css styles).
pages/api | This is the main entry point of the API. Again each endpoint has its own directory or subdirectory.
public | Contains static files.
scripts | Contains scripts used througout. Currently scripts to migrate from the old Database.
sessions | Contains session ids. (excluded from source control)
actions.js | Contains actions to alter the global state object.
firebase.js | Script to initialize the Firebase App.
reducer.js | Script to alter the global state object.
server.js | Script to start an express server and route requests as necessary.
store.js | Script setting up the global state object.
theme.js | Script to configure the App's theme.

## Technological Stack

The Entry point of the app is `server.js` it is the script that handles all requests and routes them as appropriate. It uses a session middleware to identify unique visits through cookies. It also caches requests to pages in order to avoid rebuilding them which is expensive.

The main databse server used is MongoDB. It has three collections. One for the users, another for the posts and finally a third for the products and its specs.

Single sign-on is used across this website and the forum. The authentication data is sent as a JWT token through a cookie. Firebase is used as the authentication microservice.

The forum uses the NodeBB Software built atop Node.js.

The website mainly relies on the API to provide the data it needs. The first request is always handled on the server where the API is called and then the page is built or fetched from cache. Consequent requests only call the API and update the page content as necessary without rebuilding.

## Contributing

To start a development server with hot reload make a call to node.js through yout favorite package manager.

```bash
yarn dev
```

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MPL-2.0](https://www.mozilla.org/en-US/MPL/2.0/)