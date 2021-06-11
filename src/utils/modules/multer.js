const multer = require('multer');
const _ = require('lodash');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const { awsConfig, awsConfig:{s3Config} } = require('../../config');
const path = require('path');

if (process.env.NODE_ENV) {
  aws.config.update({
    accessKeyId: awsConfig.accessKey,
    secretAccessKey: awsConfig.secretKey,
    region: awsConfig.region,
  });
}

const s3 = new aws.S3();

const allowedFileTypes = /jpeg|jpg|png|gif/;

const fileFilter = function (req, file, cb) {
  const mimeTypes = allowedFileTypes.test(file.mimetype);
  const extName = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  if (mimeTypes && extName) {
    cb(null, true);
  } else {
    cb(new Error(`Error: File upload only supports the following file types:${allowedFileTypes}`));
  }
};

const listingStorage = multerS3({
  s3,
  acl: 'public-read',
  bucket: s3Config.listingImagesBucket,
  contentType: multerS3.AUTO_CONTENT_TYPE,
  metadata(req, file, cb) {
    let ext = path.extname(file.originalname);
    cb(null, {
      fileName: `${file.originalname.split('.')[0]}-${Date.now()}${ext}`,
    });
  },
  key(req, file, cb) {
    let ext = path.extname(file.originalname);
    cb(null, `${req.params.userId}/${file.originalname.split('.')[0]}-${Date.now()}${ext}`);
  },
});

const dpStorage = multerS3({
  s3,
  acl: 'public-read',
  bucket: s3Config.dpBucket,
  contentType: multerS3.AUTO_CONTENT_TYPE,
  metadata(req, file, cb) {
    let ext = path.extname(file.originalname);
    cb(null, {
      fileName: `${file.originalname.split('.')[0]}-${Date.now()}-${ext}`,
    });
  },
  key(req, file, cb) {
    let ext = path.extname(file.originalname);
    cb(null, `${req.params.userId}/${file.originalname.split('.')[0]}-${Date.now()}-${ext}`);
  },
});

const listingUpload = multer({
  storage: listingStorage,
  limits: { fileSize: s3Config.maxFileSize },
  fileFilter,
});
const dpUpload = multer({ storage: dpStorage, limits: { fileSize: s3Config.maxFileSize }, fileFilter });

class MulterMiddleware {
  static single(name) {
    const middleware = dpUpload.single(name);

    return (req, res, next) =>
      middleware(req, res, (result) => {
        if (_.isObjectLike(req.file)) {
          req.body[name] = req.file;
        }
        return next(result);
      });
  }

  static array(name, maxCount) {
    const middleware = listingUpload.array(name, maxCount);

    return (req, res, next) =>
      middleware(req, res, (result) => {
        if (req.files.length) {
          req.body[name] = req.files;
        }
        return next(result);
      });
  }

  /*
  static fields(fields = []) {
    const middleware = upload.fields(fields);
    return (req, res, next) =>
      middleware(req, res, (result) => {
        fields.forEach((v) => {
          if (v.name in req.files) {
            req.body[v.name] = req.files[v.name];
          }
        });
        return next(result);
      });
  }
  */
}

module.exports = MulterMiddleware;
