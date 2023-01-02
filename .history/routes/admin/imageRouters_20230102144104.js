// routers 에서 경로 바꿔주면서 fs에서 파일 받아와서 controller 에서 return 컨트롤러까지 존재
const express = require('express'); 
const router = express.Router();
const BoardController = require('../../controllers/admin/boardController');
const fs = require('fs'); // file 생성시 필요
