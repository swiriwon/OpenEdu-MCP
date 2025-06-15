// backend/server.js

const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./api/auth');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`✅ OpenEdu 서버 실행 중: http://localhost:${PORT}`);
});
