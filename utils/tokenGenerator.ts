// this function will be used to authorize requests to our api
import jwt from "jsonwebtoken";

const tokenGenerator = (): string => {
  // Payload can be an object containing any relevant user information
  const payload = process.env.EXPO_PUBLIC_JWT_AUTH!;

  // Secret key should be kept safe (use environment variables in real projects)
  const secretKey = process.env.EXPO_PUBLIC_JWT_SECRET!;

  // Generate the token
  const token = jwt.sign(payload, secretKey, { expiresIn: "1h" }); // Expires in 1 hour

  return token;
};

// Example usage
console.log(tokenGenerator());
