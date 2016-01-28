A Minimal Electron + React + ES6 boilerplate with builtin packaging.

## Getting started:

After you clone the repo just:

```
npm install
npm start
```

You are ready to code with hot code reloading and automatic updates.

**NOTE:** You may have to refresh the page just one time when you launch the app since we start both webpack watch and electron at the same time. Don't panic if you start the app and see a blank page, just hit refresh and you'll be welcomed :)


## Packaging

Edit your app name in the package.json, under the scripts/build section:

```
"scripts": {
  ...,
  "build": "node_modules/.bin/webpack . && node_modules/.bin/electron-packager ./dist YOUR_APP_NAME_HERE --platform=darwin --arch=x64 --version=0.36.5 --asar=true",
  ...
}
```

You can package a Mac OSX app by running the following command:

```
npm run build
```

You can easily modify package.json to add new platforms and configurations as needed.
