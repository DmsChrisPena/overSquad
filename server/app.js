import express from 'express';
import chalk from 'chalk';
import path from 'path';
import bodyParser from 'body-parser';

import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import config from '../webpack.config.js';

import teamController from './controllers/teamController.js';
import herosController from './controllers/herosController.js';

const compiler = webpack(config);
const middleware = webpackMiddleware(compiler, {
  publicPath: config.output.publicPath,
  contentBase: 'src',
  stats: {
    colors: true,
    hash: false,
    timings: true,
    chunks: false,
    chunkModules: false,
    modules: false
  }
});

const app = express();

app.use(bodyParser.json());

// Api Calls

app.get('/api/team', teamController.get);

// Heros API
app.get('/api/heros', herosController.getAll);
app.get('/api/heros/:heroName', herosController.getHero)
app.get('/api/herosList', herosController.getHerosList);
app.post('/api/update/heros', herosController.updateHeros);

app.use(middleware);
app.use(webpackHotMiddleware(compiler));
app.get('*', function response(req, res) {
  res.write(middleware.fileSystem.readFileSync(path.join(__dirname, '../dist/index.html')));
  res.end();
});

const port = 1337;
app.listen(port, function() { console.log(`Running on port ${port}`)});
