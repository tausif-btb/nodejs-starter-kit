import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'My API',
    description: 'Description'
  },
  host: 'localhost:5000/api'
};

const outputFile = './swagger-output.json';
const routes = ['./routes/userRoutes.js']

swaggerAutogen()(outputFile, routes, doc);

