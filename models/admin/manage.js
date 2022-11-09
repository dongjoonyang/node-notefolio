const db_config = require('../../config/mysql');
const conn = db_config.init();
db_config.connect(conn);

let Manage = function (){}; // 생성자

// 카테고리 쿼리
Manage.manageData = function(mainId,result){
    let query1 = "SELECT * FROM main_category;";
    let query2 = "SELECT * FROM sub_category;";
    // 게시판
    let query3 = "SELECT idx, image, title, content, date_format(regdate, '%Y-%m-%d %H:%i:%s') regdate," 
                + "date_format(modidate, '%Y-%m-%d %H:%i:%s') modidate, main_id, sub_id FROM board WHERE main_id = ?";

    conn.query(query1 + query2 + query3, [mainId], function(err, res){
        if(err){
            result(null, err);
        } else {
            let res1 = res[0];
            let res2 = res[1];
            let res3 = res[2];
            result(null, res1, res2, res3);
        }
    });
};

// 카테고리 쿼리
Manage.manageCategoryData = function(result){
    let query1 = "SELECT * FROM main_category;";
    let query2 = "SELECT * FROM sub_category;";
    
    conn.query(query1 + query2, function(err, res){
        if(err){
            result(null, err);
        } else {
            let res1 = res[0];
            let res2 = res[1];
            result(null, res1, res2);
        }
    });
};

// 카테고리 등록
Manage.manageCategoryProcess = function(subTitle, mainId, result){
    let insert = "INSERT INTO sub_category (sub_title, main_id) VALUES(?,?);";
    let autoIncrement = "ALTER TABLE sub_category auto_increment = 0; SET @COUNT = 0; UPDATE sub_category SET sub_id = @COUNT:=@COUNT+1;"; 

    conn.query(insert + autoIncrement, [subTitle, mainId], function(err, res){
        if(err){
            result(null, err);
        } else {
            result(null, res);
        }
    });
};

// 카테고리 수정
Manage.manageCategoryUpdateProcess = function(subTitle, subId, result){
    conn.query("update sub_category set SUB_TITLE = ? where sub_id = ?", [subTitle, subId], function(err, res){
        if(err){
            result(null, err);
        } else {
            result(null, res);
        }
    });
};

// 카테고리 삭제
Manage.manageCategoryDeleteProcess =  function(id, result){
    conn.query("delete from sub_category where sub_id = ?", id, function(err, res){
        if(err){
            result(null, err);
        } else {
            console.log(result);
            result(null, res);
        }
    });
};

// 메인 게시판 목록 불러오기
Manage.manageMainBoardData = function(mainId, result){
    let query = "SELECT idx, image, title, content, date_format(regdate, '%Y-%m-%d %H:%i:%s') regdate," 
                + "date_format(modidate, '%Y-%m-%d %H:%i:%s') modidate, main_id, sub_id FROM board WHERE main_id = ?";

    conn.query(query, [mainId], function(err, res){
        if(err){
         result(null, err);
        } else {
            result(null, res);
        }
    });
};

// 서브 게시판 목록 불러오기
Manage.manageSubBoardData = function(mainId, subId, result){
    let query = "SELECT idx, image, title, content, date_format(regdate, '%Y-%m-%d %H:%i:%s') regdate," 
                + "date_format(modidate, '%Y-%m-%d %H:%i:%s') modidate, main_id, sub_id FROM board WHERE main_id = ? and sub_id = ?";

    conn.query(query, [mainId, subId], function(err, res){
        if(err){
         result(null, err);
        } else {
            result(null, res);
        }
    });
};

module.exports = Manage;