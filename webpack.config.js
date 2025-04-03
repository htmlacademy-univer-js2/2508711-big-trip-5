const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');

const mode = process.env.NODE_ENV || 'development';
const isProduction = mode === 'production';

module.exports = {
  mode, // Устанавливаем режим в зависимости от окружения
  entry: './src/main.js', // Точка входа
  output: {
    filename: 'bundle.[contenthash].js', // Имя бандла с хэшированием
    path: path.resolve(__dirname, 'build'), // Директория для сборки
    clean: true, // Очистка перед новой сборкой
  },
  devtool: isProduction ? 'source-map' : 'inline-source-map', // Генерация карты исходного кода
  resolve: {
    extensions: ['.js', '.json'], // Поддержка JSON-файлов
  },
  devServer: {
    static: path.resolve(__dirname, 'public'), // Указываем корневую папку
    compress: true, // Сжатие файлов
    port: 8080, // Порт сервера
    open: true, // Автоматически открывает браузер
    hot: true, // Горячая перезагрузка
  },
  plugins: [
    new HtmlPlugin({
      template: 'public/index.html', // Шаблон HTML
    }),
    new CopyPlugin({
      patterns: [
        {
          from: 'public',
          to: 'build',
          globOptions: {
            ignore: ['**/index.html'],
          },
        },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
