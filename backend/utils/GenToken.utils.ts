import * as jwt from 'jsonwebtoken';

export const sign = async (payload: object, expiresIn: any, secret: string) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      secret,
      {
        expiresIn: expiresIn,
      },
      (error, token) => {
        if (error) {
          console.log("JWT Error: ", error);
          reject(error);
        } else {
          resolve(token);
        }
      }
    );
  });
};
export const verify = async (token: string, secret: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (error, payload) => {
      if (error) {
        resolve(null);
      } else {
        resolve(payload);
      }
    });
  });
};