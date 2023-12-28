require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/error-handler');
const swaggerOptions = require('./config/swagger');

// routes
const authRoute = require('./routes/authRoute');
const gigRoute = require('./routes/gigRoute');
const reviewRoute = require('./routes/reviewRoute');
const orderRoute = require('./routes/orderRoute');
const conversationRoute = require('./routes/conversationRoute');
const messageRoute = require('./routes/messageRoute');

const app = express();

// middlewares
app.use(morgan('tiny'));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Implement CORS
app.use(cors());

// Set security HTTP headers
app.use(helmet());

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [],
  })
);

app.use(compression());

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/gigs', gigRoute);
app.use('/api/v1/reviews', reviewRoute);
app.use('/api/v1/orders', orderRoute);
app.use('/api/v1/conversations', conversationRoute);
app.use('/api/v1/messages', messageRoute);

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`App is running at port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
