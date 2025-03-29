const jwt = require("jsonwebtoken");
const { prisma } = require("../config/db.js");

const tokenRefreshMiddleware = async (req, res, next) => {
  try {
    // Skip if no cookies or no JWT
    if (!req.cookies || !req.cookies.jwt) {
      return next();
    }

    const token = req.cookies.jwt;
    
    try {
      // Try to decode the token
      const decoded = jwt.decode(token);
      
      if (!decoded || !decoded.exp) {
        return next();
      }
      
      // Calculate time until expiration in seconds
      const currentTime = Math.floor(Date.now() / 1000);
      const timeUntilExpiration = decoded.exp - currentTime;
      
      // If token is about to expire in the next 30 minutes (1800 seconds), refresh it
      if (timeUntilExpiration > 0 && timeUntilExpiration < 1800) {
        console.log("Token is about to expire, refreshing...");
        
        // Get user from database
        const user = await prisma.user.findUnique({
          where: { id: decoded.id },
          include: { role: true },
        });

        if (!user) {
          return next();
        }

        // Generate a new token
        const newToken = jwt.sign(
          {
            id: user.id,
            role: user.role?.roleType,
          },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "5h" }
        );

        // Set the new token in a cookie
        res.cookie("jwt", newToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production" ? true : false,
          sameSite: "Lax",
          maxAge: 5 * 60 * 60 * 1000, // 5 hours in milliseconds
        });
        
        // Update the token in the request for the current request
        req.cookies.jwt = newToken;
      }
      
      next();
    } catch (error) {
      // If there's an error, just continue to the next middleware
      console.error("Token refresh middleware error:", error);
      next();
    }
  } catch (error) {
    console.error("Token refresh middleware error:", error);
    next();
  }
};

module.exports = tokenRefreshMiddleware;