import { check } from 'express-validator';

export default [
  check('phone')
    .isMobilePhone('es-MX')
    .withMessage(
      'Verifica el número de teléfono: 10 dígitos, sin espacios ni guiones'
    )
    .isLength({ min: 10, max: 10 })
    .withMessage('El número de teléfono debe tener 10 dígitos'),
];
