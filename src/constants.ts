export const TOKEN = 'P20_QAPI_TOKEN';
export const TOKEN_EXPIRATION = 'P20_QAPI_TOKEN_EXPIRATION';
export const SERVER_URI = process.env.NODE_ENV === 'production' ? 'https://poland20.com' :
  `http://${window.location.hostname}:4000`;