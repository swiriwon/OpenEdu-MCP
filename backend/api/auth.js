// backend/api/auth.js

const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const USERS_FILE = path.join(__dirname, '..', 'data', 'users.json');

// 유틸: 비밀번호 해시
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

// 유저 저장 함수
const saveUser = (user) => {
  const users = getUsers();
  users.push(user);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// 유저 불러오기
const getUsers = () => {
  if (!fs.existsSync(USERS_FILE)) return [];
  const data = fs.readFileSync(USERS_FILE);
  return JSON.parse(data);
};

// 회원가입
router.post('/register', (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) return res.status(400).json({ message: '필수 항목 누락' });

  const users = getUsers();
  if (users.find((u) => u.email === email)) return res.status(409).json({ message: '이미 가입된 이메일' });

  const newUser = {
    id: Date.now(),
    email,
    name,
    password: hashPassword(password),
  };

  saveUser(newUser);
  res.status(201).json({ message: '회원가입 완료', user: { id: newUser.id, email: newUser.email, name: newUser.name } });
});

// 로그인
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === hashPassword(password));

  if (!user) return res.status(401).json({ message: '로그인 실패' });
  res.status(200).json({ message: '로그인 성공', user: { id: user.id, email: user.email, name: user.name } });
});

module.exports = router;
