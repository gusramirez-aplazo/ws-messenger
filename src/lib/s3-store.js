const {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
} = require('@aws-sdk/client-s3')
const { AwsS3Store } = require('wwebjs-aws-s3')

const putObjectCommand = PutObjectCommand
const headObjectCommand = HeadObjectCommand
const getObjectCommand = GetObjectCommand
const deleteObjectCommand = DeleteObjectCommand

let store = null

const storeFactory = (s3Client) => {
  if (!store) {
    store = new AwsS3Store({
      bucketName: 'my-media',
      remoteDataPath: 'store/secured/',
      s3Client: s3Client,
      putObjectCommand,
      headObjectCommand,
      getObjectCommand,
      deleteObjectCommand,
    })
  }

  return store
}

module.exports = { storeFactory }
