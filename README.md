Plaidform - Component-based, Flambe inspired, ES6, Webpack modular Javascript framework for game dev...
===

### Install

Navigate to your local repository working copy then:

```bash
npm install
```

### CSS?

CSS files are maintained by writing .less [see http://lesscss.org/] files (in static/assets/css) - these are turned into CSS and bundled into the main.js via webpack, so don't expect to see .css files any place!

### Images?

Image files are maintained by populating the images dir (static/assets/images) [a script mapping working files via an optimisation pipeline exists]...

### Audio?

Audio files are maintained by populating the audio dir (static/assets/audio) [a script mapping working files via an optimisation pipeline into here is forthcoming]...

### Live reload (normal development workflow)

Executes Webpack compilation and live reload functionality: visit http://localhost:8080/webpack-dev-server/index.html
```bash
npm run serve
```

### Production release (for client delivery)

Executes Webpack compilation and static file copy into build-release dir
```bash
npm run build-release
```

### Development release (for internal delivery)

Executes Webpack compilation and static file copy into build-debug dir
```bash
npm run build-debug
```

### Documentation

Non existent. The Entity/Component system is very close to Flambe however [https://github.com/aduros/flambe]. This project is best understood as being a high level game development framework, utilising Pixi via an entity/component architecture, and a webpack based build pipeline aimed at the agency production environment.
