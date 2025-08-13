import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
     
    try {
        // Check rate limit for the user based on their IP address
        const {success} = await ratelimit.limit("my-rate-limit")

        if (!success) {
            return res.status(429).json({ message: "Too many requests, please try again later.", 
    })
  }
        // If the request is within the limit, proceed to the next middleware
            next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.log("Rate limit error:", error);
        next(error); // Call next with the error to handle it in the error handler  
    }
};

export default rateLimiter;