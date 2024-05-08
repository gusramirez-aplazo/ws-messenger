import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { AwsS3Store } from 'wwebjs-aws-s3'

const putObjectCommand = PutObjectCommand
const headObjectCommand = HeadObjectCommand
const getObjectCommand = GetObjectCommand
const deleteObjectCommand = DeleteObjectCommand

/**
 * @type {typeof AwsS3Store | null}
 */
let store = null

/**
 *
 * @param {S3Client} s3Client
 * @returns {typeof AwsS3Store}
 */
export const storeFactory = (s3Client) => {
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
