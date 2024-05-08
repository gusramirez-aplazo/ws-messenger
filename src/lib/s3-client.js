import { S3Client } from '@aws-sdk/client-s3';
import {
  cloudFlareUrl,
  s3AccessKeyId,
  s3SecretAccessKey,
} from '../config/index.js';

/**
 * @type {S3Client | null}
 */
let s3 = null;

export const s3Factory = () => {
  if (!s3) {
    s3 = new S3Client({
      region: 'auto',
      endpoint: cloudFlareUrl,
      credentials: {
        accessKeyId: s3AccessKeyId,
        secretAccessKey: s3SecretAccessKey,
      },
    });
  }
  return s3;
};
