const express = require('express');
const multer = require('multer');
const path = require('path');

const { getUserToken } = require('../jwt/jwt');
const { File } = require('../models/filesModel');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    const name = `${Date.now()}_${file.originalname}`;
    cb(null, name);
  },
});

const fileUploadMiddleWare = multer({
  storage: storage,
});

const fileRouter = express.Router();

// fileRouter.get('/', async (request, response) => {
//   const files = await File.find();
//   console.log(files);
//   response.json({
//     files,
//   });
// });

fileRouter.get('/', async (request, response) => {
  const token = request.headers.authorization;
  //console.log(token);
  const payload = getUserToken(token);
  //console.log(payload);
  const userId = payload._id; // assuming the user's ObjectId is stored in the 'id' field of the payload

  const files = await File.find({ user: userId });
  // files.pop();
  // files.pop();
  //console.log(files);
  response.json({ files });
});

fileRouter.post('/upload', fileUploadMiddleWare.any(), (request, response) => {
  const user_id = request.user._id;
  const files = request.files.map(
    ({ originalname, filename, mimetype, path, size }) => {
      return {
        user: user_id,
        originalname,
        filename,
        mimetype,
        path,
        size,
      };
    }
  );

  File.create(files)
    .then((result) => {
      response.json({ file: result });
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

fileRouter.get('/download/:fileId', (request, response) => {
  try {
    const { fileId } = request.params;
    const fileObj = File.findById(fileId);
    const pathFile = path.json(process.cwd(), fileObj.path);
    response.download(pathFile);
  } catch (error) {
    response.json({
      error,
    });
  }
});

module.exports = {
  fileRouter,
};
