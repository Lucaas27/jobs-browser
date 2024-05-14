import cors from 'cors';
const allowedOrigins: string[] = ['http://localhost:5000', 'http://localhost:5173', 'http://localhost:3000'];

const corsOptions: cors.CorsOptions = {
  origin: (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => {
    if (allowedOrigins.indexOf(origin!) !== -1 || !origin) {
      // if origin is found in the allowedOrigins array
      // or if the origin is not provided (for same-origin requests)
      // the callback function is called with null and true to allow the request
      callback(null, true);
    } else {
      // otherwise, the callback function is called with an error
      // and false to disallow the request
      callback(new Error('Not allowed by CORS'));
    }
  },
  // Specifies the HTTP methods allowed for CORS requests
  // By default, all methods are allowed
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  credentials: true, // Indicates whether the server should include credentials (such as cookies or HTTP authentication) in CORS requests
  optionsSuccessStatus: 200, // Specifies the HTTP status code to use for successful CORS preflight OPTIONS requests
  //   allowedHeaders: ['Content-Type', 'Authorization'], // Specifies the allowed headers for CORS requests
};

export { corsOptions };
