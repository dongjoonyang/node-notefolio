const express = require('express'); 
const router = express.Router();
const fs = require('fs'); // file 생성시 필요

/**
* =======================================
* 설  명 : 초기값 uploads images 리스트 
* =======================================
*/ 
/* Default url : admin/images */ 
router.get('/', function(req, res, next){ 
    let file = new Array();

    // upload images list
    fs.readdir("./public/uploads", (err, files) => {
        if (err) {
            throw err;
        }

        file = files;
        res.render('admin/images',{
            imgFile : file
        });
    });
});

/**
* =======================================
* 설  명 : uploads images 리스트 삭제
* =======================================
*/ 
router.post('/del', function(req, res, next){ 
    let imgName = req.body.image;

    if(!Array.isArray(imgName)){ // 배열이 아니면
        fs.unlink(`./public/uploads/${imgName}`, err => {
            if (err) throw err;
            fnFileLoadHandler(res);
        });

    } else {
        for(let i = 0; i < imgName.length; i++) {
            fs.unlink(`./public/uploads/${imgName[i]}`, err => {
                if (err) throw err;
                if(i == (imgName.length - 1)) { // response 두번 발생 안하게 방지
                    fnFileLoadHandler(res);
                }
            });
        }
    }
});

// 파일 가져오기
function fnFileLoadHandler(res) {
    let file = new Array();

    fs.readdir("./public/uploads", (err, files) => {
        if (err) {
            throw err;
        }
        file = files;
        res.json(file); 
    });
}

module.exports = router;
