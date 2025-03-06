import { expressjwt } from "express-jwt";
import 'dotenv/config.js';

// Verifica que la variable de entorno TOKEN_SECRET esté definida
if (!process.env.TOKEN_SECRET) {
  throw new Error("TOKEN_SECRET is not defined in the environment variables");
}

// Instantiate the JWT token validation middleware
const isAuthenticated = expressjwt({
  secret: process.env.TOKEN_SECRET,
  algorithms: ["HS256"],
  requestProperty: "payload",
  getToken: getTokenFromHeaders,
});

// Function used to extract the JWT token from the request's 'Authorization' Headers
function getTokenFromHeaders(req) {
  // Check if the token is available on the request Headers
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    // Get the encoded token string and return it
    const token = req.headers.authorization.split(" ")[1];
    return token;
  }

  return null;
}

// Export the middleware so that we can use it to create protected routes
export { isAuthenticated };