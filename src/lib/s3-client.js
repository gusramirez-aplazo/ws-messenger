const { S3Client } = require('@aws-sdk/client-s3')
const { cloudFlareUrl, s3AccessKeyId, s3SecretAccessKey } = require('../config')

let s3 = null

const s3Factory = () => {
  if (!s3) {
    s3 = new S3Client({
      region: 'auto',
      endpoint: cloudFlareUrl,
      credentials: {
        accessKeyId: s3AccessKeyId,
        secretAccessKey: s3SecretAccessKey,
      },
    })
  }
  return s3
}

module.exports = { s3Factory }
