import jwt from "jsonwebtoken";

const {
  ACCESS_TOKEN_SECRET_KEY = "",
  REFRESH_TOKEN_SECRET_KEY = "",
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
} = process.env;

interface IUser {
  userId: string;
  userName: string;
  userEmail: string;
}

export const assignTokens = (user: {
  _id: string;
  name: string;
  email: string;
}) => {
  const payload: IUser = {
    userId: user._id,
    userName: user.name,
    userEmail: user.email,
  };

  const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET_KEY, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
  const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET_KEY, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });

  return { accessToken, refreshToken };
};
