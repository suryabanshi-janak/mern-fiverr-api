const options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'MERN Fiverr API',
      version: '0.1.0',
      description:
        'This project is focused on showcasing fundamental backend features of a Fiverr build with NodeJSs',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

module.exports = options;
