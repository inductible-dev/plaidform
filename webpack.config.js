var path = require('path');
var webpack = require('webpack');

const ENV = process.env.NODE_ENV ;

var config = {
  entry: [
    'babel-polyfill',
    './static/assets/css/main.less',
    './src/main'    
  ],
  output: {
      filename: 'main.js'      
  },
  resolve: {
    alias:{
      '~': path.resolve( __dirname, 'src' ),
      'node_modules': path.resolve( __dirname, 'node_modules' )
    },
    extensions: ['', '.js']
  },
  debug: true,
  module: {
    loaders: [
      {
        test: /\.worker\.js$/,
        loader: "worker-loader!babel-loader",
        presets: ['es2015']
      },
      { 
        test: /\.js$/,
        include: path.join(__dirname, 'src'),
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
      { 
        test: /\.less$/,
        loader: "style!css!autoprefixer!less"
      },
    ]
  }   
};

switch(ENV)
{
  case "production":
    console.log("--------------- USING production");
    config.output.path = path.resolve( __dirname, 'build-release' ) ;    
  break;
  case "development":
    console.log("--------------- USING development");
    config.output.path = path.resolve( __dirname, 'build-debug' ) ;    
    config.devtool = 'source-map';
  break;
  default:
    console.log("--------------- USING default");
    config.entry.push('webpack-dev-server/client?http://localhost:8080');
    config.devServer = { 
      contentBase: "./static" ,      
    };    
    config.devtool = 'source-map';
}

module.exports = config ;
