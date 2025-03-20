import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  const token = jwt.sign({ user }, process.env.SECRET_KEY, {
    expiresIn: "100 days",
  });
  return token;
};

export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    return decoded;
  } catch (error) {
    return null;
  }
};

export const authenticateToken = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).send("Access Denied. No token provided.");
  const decoded = verifyToken(token);
  if (!decoded) return res.status(400).send("Invalid Token");
  req.user = decoded.user;
  next();
};
