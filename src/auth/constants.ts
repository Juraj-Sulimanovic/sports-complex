export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'your-secret-key-here', // Fallback to a default value if not set
};
