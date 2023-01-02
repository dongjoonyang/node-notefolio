const express = require('express'); 
const router = express.Router();
const fs = require('fs'); // file 생성시 필요


/**
* =======================================
* 설  명 : uploads images 확인
* =======================================
*/ 
/* Default url : admin/images */ 
router.get('/', function(req, res, next){ 
    let imgFile = new Array() ;
    // upload images list
    fs.readdir("./public/uploads", (err, files) => {
        if (err) {
        throw err;
        }
        // files.forEach(file => {
        //     imgFile = file;
        //     console.log(imgFile)
        // });
        console.log(files[0]);
    });

    res.render('admin/images',{
        imgFile : imgFile
    });
});

module.exports = router;
