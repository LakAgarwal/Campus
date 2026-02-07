require('dotenv').config();

const config = {
  apiKey: process.env.BREVO_API_KEY,
  sender: {
    name: 'Team Nyquix',
    email: 'id.yogeshgarg@gmail.com',
  },
  apiUrl: process.env.API_URL || 'http://localhost:8080/api',
};

if (!config.apiKey) {
  throw new Error('BREVO_API_KEY is not defined in .env file');
}

module.exports = config;