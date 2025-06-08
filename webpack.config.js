const path = require('path');

module.exports = {
  entry: './PDFGenerator/pdf-generator.worker.ts',
  output: {
    path: path.resolve(__dirname, 'out'),
    filename: 'pdf-worker.bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [{ test: /\.ts$/, loader: 'ts-loader' }],
  },
};
