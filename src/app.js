require('dotenv').config();

const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const swaggerSpec = require('./docs/swagger');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const notFoundMiddleware = require('./middlewares/notFoundMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', routes);

app.use(express.static(path.join(__dirname, '..')));
app.use(
    "/vendor/chartjs",
    express.static(
        path.join(
            __dirname,
            "..",
            "node_modules",
            "chart.js",
            "dist"
        )
    )
);

app.use(notFoundMiddleware);
app.use(errorHandler);


const start = async () => {
  try {
    const pool = require('./config/database');
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    console.log('Database connection established successfully.');

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Swagger docs at http://localhost:${PORT}/api/docs`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

start();
