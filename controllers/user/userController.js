const User = require("../../models/user/user");


// 카테고리 메인 리스트 및 메인 게시판 컨트롤러
exports.manageData = function(req, res){
    let mainId = req.params.mainId;
    let off = req.params.off;
    
    User.manageData(mainId, off, function(err, result1, result2, result3){
        if(err){
            res.send(err);
        } else {
            res.json({
                // 카테고리
                rows1 : result1,
                rows2 : result2,
                // 게시판
                rows3 : result3,
                length : result3.length - 1, // 페이지 넘어갈때를 대비한 수
                mainId: mainId,
                off: Number(off)
            }); 
        }
    });
};

// 카테고리 관리 컨트롤러
exports.catgoryData = function(req, res){
    User.categoryData(function(err, result1, result2){
        if(err){
            res.send(err);
        } else {
            res.json({
                rows1 : result1, 
                rows2 : result2
            });
        }
    });
};

// 서브 카테 게시판 컨트롤러
exports.subBoardData = function(req, res){
    let mainId = req.params.mainId;
    let subId = req.params.subId;
    let off = req.params.off;

    User.subBoardData(mainId, subId, off, function(err, result){
        if(err){
            res.send(err);
        } else {
            console.log("sub ? off ::::::::::" + off)
            res.send({
                rows3 : result,
                length : result.length - 1,
                off: Number(off)
            });
        }
    });
};

// 글 상세 컨트롤러
exports.boardRead = function(req, res){
    let idx = req.params.idx;
    let mainId = req.params.mainId;
    let subId = req.params.subId;

    User.boardRead(idx, mainId, subId, function(err, result){
        if(err){
            res.send(err);
        } else {
            res.send({
                idx : idx,
                mainId : mainId,
                subId : subId,
                rows : result
            });
        }
    });
};