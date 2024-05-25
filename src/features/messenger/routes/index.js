import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { validationResult } from 'express-validator';
import wsPckg from 'whatsapp-web.js';
import { misaMapsUrl } from '../../../config/index.js';
import { RuntimeMsgrError } from '../../../lib/runtime-error.js';
import { s3Factory } from '../../../lib/s3-client.js';
import { storeFactory } from '../../../lib/s3-store.js';
import { wsClientFactory } from '../../../lib/ws-client.js';
import phoneValidator from '../infra/middleware/phone.js';

const s3Client = s3Factory();
const store = storeFactory(s3Client);
const wsClient = wsClientFactory(store);
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // Limit each IP to 5 requests per `window` (here, per 5 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
const messengerRouter = Router();

messengerRouter.use(limiter);

messengerRouter.post('/misa', phoneValidator, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ ok: false, errors: errors.array() });
  }

  const { phone } = req.body;

  try {
    await wsClient.getState().catch((err) => {
      throw new RuntimeMsgrError(
        'Error al obtener el estado del cliente::' + err,
        'WsClient::getState::unknown'
      );
    });

    const signedUrl = await getSignedUrl(
      s3Client,
      new GetObjectCommand({ Bucket: 'my-media', Key: 'misa.jpg' }),
      { expiresIn: 60 * 2 }
    ).catch((err) => {
      throw new RuntimeMsgrError(
        'Error al obtener la URL firmada::' + err,
        'GetSignedUrl::unknown'
      );
    });

    const media = await wsPckg.MessageMedia.fromUrl(signedUrl).catch((err) => {
      throw new RuntimeMsgrError(
        'Error al obtener message media::' + err,
        'MessageMedia::fromUrl::unknown'
      );
    });

    const numberId = await wsClient.getNumberId(phone).catch((err) => {
      throw new RuntimeMsgrError(
        'Error al obtener el número de teléfono::' + err,
        'WsClient::getNumberId::unknown'
      );
    });

    if (!numberId) {
      return res.status(404).json({
        ok: false,
        error: 'El número de teléfono no se encuentra en Whatsapp',
      });
    }

    const isRegistered = await wsClient
      .isRegisteredUser(numberId._serialized)
      .catch((err) => {
        throw new RuntimeMsgrError(
          'Error al verificar si el número de teléfono está registrado::' + err,
          'WsClient::isRegisteredUser::unknown'
        );
      });

    if (!isRegistered) {
      return res.status(404).json({
        ok: false,
        error:
          'Parece que el número de teléfono no está registrado como usuario de Whatsapp',
      });
    }

    const result = await wsClient
      .sendMessage(numberId?._serialized, media, {
        caption: misaMapsUrl,
      })
      .catch((err) => {
        throw new RuntimeMsgrError(
          'Error al enviar el mensaje::' + err,
          'WsClient::sendMessage::unknown'
        );
      });

    return res.json({
      result: result.id.id,
      ok: true,
      error: null,
    });
  } catch (error) {
    if (error instanceof RuntimeMsgrError) {
      return res.status(500).json({
        ok: false,
        error: error.message,
        code: error.code,
      });
    }

    return res.status(500).json({
      ok: false,
      error: error?.message ?? error?.error ?? error,
    });
  }
});

messengerRouter.post('/party', phoneValidator, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ ok: false, errors: errors.array() });
  }

  const { phone } = req.body;

  try {
    await wsClient.getState().catch((err) => {
      throw new RuntimeMsgrError(
        'Error al obtener el estado del cliente::' + err,
        'WsClient::getState::unknown'
      );
    });

    const signedUrl = await getSignedUrl(
      s3Client,
      new GetObjectCommand({ Bucket: 'my-media', Key: 'kids.webp' }),
      { expiresIn: 60 * 2 }
    ).catch((err) => {
      throw new RuntimeMsgrError(
        'Error al obtener la URL firmada::' + err,
        'GetSignedUrl::unknown'
      );
    });

    const media = await wsPckg.MessageMedia.fromUrl(signedUrl).catch((err) => {
      throw new RuntimeMsgrError(
        'Error al obtener message media::' + err,
        'MessageMedia::fromUrl::unknown'
      );
    });

    const numberId = await wsClient.getNumberId(phone).catch((err) => {
      throw new RuntimeMsgrError(
        'Error al obtener el número de teléfono::' + err,
        'WsClient::getNumberId::unknown'
      );
    });

    if (!numberId) {
      return res.status(404).json({
        ok: false,
        error: 'El número de teléfono no se encuentra en Whatsapp',
      });
    }

    const isRegistered = await wsClient
      .isRegisteredUser(numberId._serialized)
      .catch((err) => {
        throw new RuntimeMsgrError(
          'Error al verificar si el número de teléfono está registrado::' + err,
          'WsClient::isRegisteredUser::unknown'
        );
      });

    if (!isRegistered) {
      return res.status(404).json({
        ok: false,
        error:
          'Parece que el número de teléfono no está registrado como usuario de Whatsapp',
      });
    }

    const result = await wsClient
      .sendMessage(numberId?._serialized, media, {
        caption: misaMapsUrl,
      })
      .catch((err) => {
        throw new RuntimeMsgrError(
          'Error al enviar el mensaje::' + err,
          'WsClient::sendMessage::unknown'
        );
      });

    return res.json({
      result: result.id.id,
      ok: true,
      error: null,
    });
  } catch (error) {
    if (error instanceof RuntimeMsgrError) {
      return res.status(500).json({
        ok: false,
        error: error.message,
        code: error.code,
      });
    }

    return res.status(500).json({
      ok: false,
      error: error?.message ?? error?.error ?? error,
    });
  }
});

export { messengerRouter };
