import { COOKIES_LIFE } from './constants/constants';

const jwt = require('jsonwebtoken');

/**
 *
 * @param {object} user for which the token will be generated
 * @param {number} expirationTimestamp token expiration timestamp
 * @param {string} key key that will be used to encrypt the object
 * @example getAccessToken (user);
 * @returns {string} token string
 */
export const getToken = (user, expirationTimestamp, key) => {
  return jwt.sign({ exp: expirationTimestamp, user: user }, key);
};

/**
 *
 * @param {string} token token string to be verified
 * @param {string} key secret against which token will be verified
 * @example validateToken(token, key)
 * @returns {object} error if token is not valid else user
 */
export const validateToken = (token, key) => {
  return jwt.verify(token, key);
};

/**
 *
 * @param {string} token token string to be decoded
 * @example decodeToken(token)
 * @returns {object} decoded payload or null if invalid
 */
export const decodeToken = (token) => {
  try {
    const decoded = jwt.decode(token);
    return decoded; // Return the decoded payload
  } catch (error) {
    return null; // Return null if the token is invalid
  }
};

/**
 *
 * @param {object} user User object for which the token will be generated
 * @example generateAccessToken (user)
 */
export const generateAccessToken = (user) => {
  const accessTokenExpirationTime =
    Math.floor(Date.now() / 1000) + COOKIES_LIFE.MONTH_1;
  const accessTokenSecret =
    process.env.ACCESS_TOKEN_SECRET_KEY || 'secretaccess';

  const token = getToken(user, accessTokenExpirationTime, accessTokenSecret);

  return {
    access_token: token,
    expiration_timestamp: accessTokenExpirationTime,
  };
};

/**
 *
 * @param {object} user User object for which the token will be generated
 * @example generateRefreshToken(user)
 */
export const generateRefreshToken = (user) => {
  const refreshTokenExpirationTime =
    Math.floor(Date.now() / 1000) + COOKIES_LIFE.MONTH_2; //3600 * (24 * 7) = 7 days
  const refreshTokenSecret =
    process.env.REFRESH_TOKEN_SECRET_KEY || 'secretrefresh';

  return getToken(
    { id: user.id, email: user.email, tenant_id: user.tenant_id },
    refreshTokenExpirationTime,
    refreshTokenSecret,
  );
};

/**
 *
 * @param {string} email for which to reset password link will be generated
 * @returns
 */
export const generateResetPasswordToken = (email) => {
  const expiryTime = Math.floor(Date.now() / 1000) + 3600 * (24 * 2); //3600 * (24 * 2) = 2 days
  const resetPasswordSecret =
    process.env.RESET_PASSWORD_TOKEN_SECRET_KEY || 'secretreset';

  return getToken({ email: email }, expiryTime, resetPasswordSecret);
};

/**
 * @summary This function will generate an activation token for the user
 * @param {string} email user email
 * @example generateActivationToken(test@example.com)
 * @returns
 */
export const generateActivationToken = (email) => {
  const expiryTime = Math.floor(Date.now() / 1000 + 3600 * 5);
  const userActivationTokenSecret =
    process.env.USER_ACTIVATION_TOKEN_SECRET_KEY || 'secretactivation';

  return getToken({ email: email }, expiryTime, userActivationTokenSecret);
};
