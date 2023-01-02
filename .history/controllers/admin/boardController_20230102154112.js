const Board = require("../../models/admin/board");

// 글 등록 컨트롤러
exports.boardAddProcess = function(req, res){
    let imgurl = '';
    let mainId = req.body.mainId;
    let subId = req.body.subId;
    let title = req.body.title;
    let contents = req.body.contents;

    if(req.file !== undefined) {
        imgurl = req.file.path;
        imgurl = imgurl.substr(6);
    }

    Board.boardAddProcess(imgurl, mainId, subId, title, contents, function(err, result){
        if (err) {
            res.send(err);
        } else {
            res.json({
                result : result,
                mainId : mainId, 
                subId : subId
            });
        }
    });
};

// 글 에디터 사진 등록 컨트롤러
exports.boardImage = function(req, res){
    let imgurl = '';
    if(req.file !== undefined) {
        imgurl = req.file.path;
        imgurl = imgurl.substr(6);
    }
    res.json(imgurl); 
};

// 글 상세 컨트롤러
exports.boardRead = function(req, res){
    let idx = req.params.idx;
    let mainId = req.params.mainId;
    let subId = req.params.subId;

    Board.boardRead(idx, mainId, subId, function(err, result){
        if(err){
            res.send(err);
        } else {
            res.render("admin/manageMod", {
                idx : idx,
                mainId : mainId,
                subId : subId,
                rows : result
            })
        }
    });
};

// 글 수정 컨트롤러
exports.boardUpdateProcess = function(req, res){
    let imgurl = '';
    let idx = req.body.idx;
    let mainId = req.body.mainId;
    let subId = req.body.subId;
    let title = req.body.title;
    let contents = req.body.contents;

    if(req.file !== undefined) {
        imgurl = req.file.path;
        imgurl = imgurl.substr(6);
    }
        
    Board.boardUpdateProcess(idx, imgurl, mainId, subId, title, contents, function(err, result){
        if(err){
            res.send(err);
        } else {
            res.json({
                result : result,
                mainId : mainId, 
                subId : subId
            });
        }
    });
};

// 글 삭제 컨트롤러
exports.boardDelete = function(req, res){
    let paramsIdx = req.params.idx;

    let idxArr = new Array();
    idxArr = paramsIdx.split(",");

    let queryStr = "";
    for(let i = 0; i < idxArr.length; i++){
        if(queryStr) queryStr += ",";
        queryStr += "?";
    }

    Board.boardDelete(idxArr, queryStr, function(err, result){
        if(err){
            res.send(err);
        } else {
            res.send(result);
        }
    });
};

