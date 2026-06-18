import('dotenv').then(m => m.config());

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const notFoundMiddleware = require('./middlewares/notFoundMiddleware');
const pool = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', routes);
app.use(notFoundMiddleware);
app.use(errorHandler);

pool.getConnection()
  .then(connection => {
    connection.ping();
    connection.release();
    console.log('Database connection established successfully.');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Swagger docs at http://localhost:${PORT}/api/docs`);
    });
  })
  .catch(error => {
    console.error('Unable to start server:', error);
    process.exit(1);
  });
