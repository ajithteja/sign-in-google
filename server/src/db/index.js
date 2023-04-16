const mongoose = require('mongoose');

const mongooseConnection = () => {
  mongoose
    .connect(
      'mongodb+srv://AjithTeja:Ajithteja@cluster0.s2irefp.mongodb.net/?retryWrites=true&w=majority'
    )
    .then(() => {
      console.log('mongoDb Initialized');
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = {
  mongooseConnection,
};
