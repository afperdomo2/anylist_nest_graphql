import Joi from 'joi';

export const validationSchema = Joi.object({
  // Entorno de la aplicación
  ENVIRONMENT: Joi.string()
    .valid('development', 'production')
    .default('development'),

  // Puerto de la aplicación
  PORT: Joi.number().port().default(3000),

  // Configuración de la base de datos
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().port().default(5432),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().min(8).required(),
  DB_NAME: Joi.string().required(),
});
