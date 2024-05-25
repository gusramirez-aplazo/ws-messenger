const port = process.env.PORT || 8000;
const cloudFlareUrl = process.env.CLOUDFLARE_R2_URL || '';
const s3AccessKeyId = process.env.S3_ACCESS_KEY_ID || '';
const s3SecretAccessKey = process.env.S3_SECRET_ACCESS_KEY || '';
const misaMapsUrl = process.env.MISA_MAPS_URL || '';
const kidsWorldUrl = process.env.KIDS_WORLD_URL || '';

export {
  cloudFlareUrl,
  kidsWorldUrl,
  misaMapsUrl,
  port,
  s3AccessKeyId,
  s3SecretAccessKey,
};
