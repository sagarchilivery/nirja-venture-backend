import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (data, res) => {
  const token = jwt.sign({ data }, process.env.JWT_SECRET, {
    expiresIn: "365d", // Set token expiration to 1 year
  });

  res.cookie("token", token, {
    maxAge: 365 * 24 * 60 * 60 * 1000, // Set cookie expiration to 1 year in milliseconds
    httpOnly: true, // Prevent XSS attacks
    sameSite: "strict", // Prevent CSRF attacks
    secure: process.env.NODE_ENV !== "development",
    path: "/",
  });

  return token;
};

export default generateTokenAndSetCookie;
