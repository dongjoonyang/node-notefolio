const Manage = require("../../models/admin/manage");

// 카테고리 메인 리스트 및 메인 게시판 컨트롤러
exports.manageData = function(req, res){
    let mainId = req.params.mainId;
    let page = req.params.page;
    
    Manage.manageData(mainId, function(err, result1, result2, result3){
        if(err){
            res.send(err);
        } else {
            res.render('admin/manage', {
                // 카테고리
                rows1 : result1,
                rows2 : result2,
                // 게시판
                rows3 : result3,
                page : page, // page 번호
                length : result3.length - 1, // 페이지 넘어갈때를 대비한 수
                page_num : 5 // 페이지 행 수
            }); 
        }
    });
};

// 카테고리 관리 컨트롤러
exports.manageCatgoryData = function(req, res){
    Manage.manageCategoryData(function(err, result1, result2){
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

// 카테고리 등록 컨트롤러
exports.manageCategory = function(req, res){
    let subTitle = req.body.categoryName;
    let mainId = req.body.categoryKinds;

    Manage.manageCategoryProcess(subTitle, mainId, function(err, result){
        if (err) {
            res.send(err);
        } else {
            // data json 넘겼으니 result 결과를 던져야함
            res.json(result);
        }
    });
};

// 카테고리 수정 컨트롤러
exports.manageCategoryUpdate = function(req, res){
    let subId = req.body.categorySubId;
    let subTitle = req.body.categoryName;

    Manage.manageCategoryUpdateProcess(subTitle, subId, function(err, result){
        if (err) {
            res.send(err);
        } else {
            res.json(result);
        }
    });
};

// 카테고리 삭제 컨트롤러
exports.manageCategoryDelete = function(req, res){
    let id = req.params.id;
    Manage.manageCategoryDeleteProcess(id, function(err, result){
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    });
};

// 메인 게시판 목록 불러오기 컨트롤러
exports.manageMainBoardData = function(req, res){
    let mainId = req.params.mainId;
    let page = req.params.page;

    Manage.manageMainBoardData(mainId, function(err, result){
        if(err){
            res.send(err);
        } else {
            res.send({
                rows : result,
                page : page, 
                length : result.length - 1,
                page_num : 5,
                category : "main"
            });
        }
    });
}

// 서브 게시판 목록 불러오기 컨트롤러
exports.manageSubBoardData = function(req, res){
    let mainId = req.params.mainId;
    let subId = req.params.subId;
    let page = req.params.page;

    Manage.manageSubBoardData(mainId, subId, function(err, result){
        if(err){
            res.send(err);
        } else {
            res.send({
                rows : result,
                page : page, 
                length : result.length - 1,
                page_num : 5,
                category : "sub"
            });
        }
    });
}

// 테이블 순번(인덱스) 초기화
exports.manageNumReset = function(req, res){
    Manage.manageNumReset("",function(err, result){
        if(err){
            res.send(err);
        } else {
            res.send(result);
        }
    });
}