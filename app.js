require('dotenv').config();
const express = require('express');
const cors = require('cors');
const imageRoutes = require('./routes/imageRoutes');
const userRoutes = require('./routes/userRoutes');
const { connectDB } = require('./models/db');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const multer = require('multer')
const app = express();
const path = require('path');


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger setup


const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Image Gallery API',
            version: '1.0.0',
            description: 'API для управления изображениями'
        },
        servers: [{ url: `http://localhost:${process.env.PORT}` }]
    },
    apis: ['./routes/*.js'],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
            }
        }
    },
    security: [
        {
            bearerAuth: []
        }
    ]
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api/uploads', express.static('uploads'));
// Подключение маршрутов
app.use('/api/images', imageRoutes);
app.use('/api/users', userRoutes);

module.exports = app;