var webpack = require('webpack');
const glob = require('glob');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
var autoprefixer = require('autoprefixer');
const PurifyCSSPlugin = require('purifycss-webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
var ImageminPlugin = require('imagemin-webpack-plugin').default

var inProduction = (process.env.NODE_ENV === 'production');
var window = window;
// Set vars for CleanWebpackPlugin
// the path(s) that should be cleaned
let pathsToClean = [
   
    'build'
  ]

if(inProduction){
  let pathsToClean = [
    'dist',
    'build'
  ]
}


// the clean options to use
let cleanOptions = {
  root:     path.resolve(__dirname),
  exclude:  ['/node_modules/'],
  verbose:  true,
  dry:      false
}

module.exports = {
  mode: "development", // enabled useful tools for development
/*  entry: {

      app: [

        './src/main.js',

        // Point to scss file for compiling css rather than - require('./assets/sass/styles.scss')
        './src/assets/sass/styles.scss'

      ]

  }*/
  
  entry: {
    './app.js':  './src/app.js', // will be  ./build/application/bundle.js,
    './assets/css/styles': './src/assets/sass/styles.scss'// will be  ./build/library/bundle.js
  },

  output: {

    path: path.resolve(__dirname, 'dist'),

    filename: '[name]',

    //publicPath: path.resolve(__dirname, '../')
     publicPath: '/',

  },
  devServer: {
    index: '/',
    contentBase: path.join(__dirname, "dist/"),
     
    before(app){
      app.get('/', function(req, res) {
        //res.json({ custom: 'response' });
        // similar behavior as an HTTP redirect
        // Tell webpack to redirect to /en folder in build/dist diretory.
        res.sendFile(path.join(__dirname, 'dist/en/index.html'));
      });
    }
  },
  module: {

      rules: [
        {
          test: /\.(s[ac]ss|css)$/,
          use: [
              MiniCssExtractPlugin.loader,
              {
                  loader: "css-loader",
                  options: {
                      minimize: inProduction,
                      url:false,
                  }
              },
              {
                  loader: "postcss-loader",
                  options: {
                      autoprefixer: {
                          browsers: ["last 2 versions"]
                      },
                      plugins: () => [
                          autoprefixer
                      ]
                  }
              },
              
              {
                  loader: "sass-loader",
                  options: {
                    //sourceMap: true
                  }
              }
          ]
        },
        {
            test: /\.(jpe?g|png|gif|svg)$/i,
            use: [
                {
                  loader: 'file-loader',
                  options: {
                      name: "./images/[name].[ext]"
                  }
                },
                'img-loader'
            ]

        },
        {
            test: /\.(eot|svg|ttf|woff|woff2)$/,
            loader: 'file-loader?[name].[ext]',
            options: {
              publicPath: '../../fonts/',
              
            }
        },
        { 

          test: /\.js$/, 

          exclude: /node_modules/, 

          loader: "babel-loader",
          options: {
             filename: "[name].[ext]"
          }

        }

      ]
  },
 
  
  plugins: [

    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }), 
    new MiniCssExtractPlugin({
    
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    // Remove any css that is not used in .html files. 
    /*new PurifyCSSPlugin({
      // Give paths to parse for rules. These should be absolute! 
      paths: glob.sync(path.join(__dirname, '/src/en/*.html')),

      minimize: inProduction

    }),*/
    new CleanWebpackPlugin(pathsToClean, cleanOptions),

    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, '/src/.htaccess'),
        to: '.htaccess',
        toType: 'file'
      },
      {
        from: path.join(__dirname, '/src/assets/images/'),
        to: 'assets/images/',
        toType: 'dir'
      },
      {
        from: path.join(__dirname, '/src/assets/scripts/vendor'),
        to: 'assets/scripts/vendor',
        toType: 'dir'
      },
      {
        from: path.join(__dirname, '/src/assets/fonts'),
        to: 'assets/fonts/',
        toType: 'dir'
      },
      {
        from: path.join(__dirname, '/src/en/'),
        to: 'en',
        toType: 'dir'
      },
      {
        from: path.join(__dirname, '/src/fr/'),
        to: 'fr',
        toType: 'dir'
      }

    ],  { debug: 'info' }),
    new ImageminPlugin({ test: /\.(jpe?g|png|gif|svg)$/i })
    
  ]

};

if(inProduction){

  module.exports.plugins.push(

     new UglifyJsPlugin()

  )

}