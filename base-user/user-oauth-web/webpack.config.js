var webpack             = require('webpack');
var ExtractTextPlugin   = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin   = require('html-webpack-plugin');

// 环境变量配置，dev / online
var WEBPACK_ENV         = process.env.WEBPACK_ENV || 'dev';
// 获取html-webpack-plugin参数的方法 
var getHtmlConfig = function(name, title){
	return {
		template    : './src/view/' + name + '.html', 
		filename    : 'view/' + name + '.html',
		favicon     : './favicon.ico',
		title       : title + '- 用户中心',
		inject      : true,
		hash        : true,
		chunks      : ['common', name]
	};
};
// webpack config
var config = {
	entry: {
		'common'             : ['./src/page/common/index.js'],
		'index'              : ['./src/page/index/index.js'],
		'result'             : ['./src/page/result/index.js'],
	},
	output: {
		path        : __dirname + '/dist/',
		publicPath  : 'dev' === WEBPACK_ENV ? '/dist/' : '//s.user.com/dist/',
		filename    : 'js/[name].js'
	},
	resolve : {
		alias : {
			node_modules    : __dirname + '/node_modules',
			util            : __dirname + '/src/util',
			page            : __dirname + '/src/page',
			service         : __dirname + '/src/service',
			image           : __dirname + '/src/image'
		}
	},
	externals : {
		'jquery' : 'window.jQuery'
	},
	module: {
		loaders: [
			// css文件的处理
			{ test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader","css-loader") },
			// 图片和字体文件的处理
			{ test: /\.(gif|png|jpg|woff|svg|eot|ttf)\??.*$/, loader: 'url-loader?limit=100&name=resource/[name].[ext]' },
			// 模板文件的处理
			{ 
				test: /\.string$/, 
				loader: 'html-loader',
				query : {
					minimize : true,
					removeAttributeQuotes :false
				}
			}
		]
	},
	plugins: [
		// 独立通用模块到js/base.js
		new webpack.optimize.CommonsChunkPlugin({
			name : 'common',
			filename : 'js/base.js'
		}),
		// 把css单独打包到文件里
		new ExtractTextPlugin("css/[name].css"),
		// html模板的处理
		new HtmlWebpackPlugin(getHtmlConfig('index', '首页')),
		new HtmlWebpackPlugin(getHtmlConfig('result', '操作结果')),
	],
	devServer: {
        port: 8088,
        inline: true,
        historyApiFallback: {
            index: '/dist/view/index.html'
        },
        proxy: {
            '/user/*' : {
                target: 'http://localhost:8080/',
                changeOrigin : true
            }
        }
    }
};

module.exports = config;