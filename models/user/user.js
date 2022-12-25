/**
* =======================================
* 설  명 : 데이터베이스 Mysql
* =======================================
*/
const db_config = require('../../config/mysql');
const conn = db_config.init();
db_config.connect(conn);

let User = function (){}; // 생성자


// 카테고리 쿼리
User.manageData = function(mainId, off, result){
    let query1 = "SELECT * FROM main_category;";
    let query2 = "SELECT * FROM sub_category;";
    let query3 = `SELECT * FROM board WHERE main_id = ? LIMIT 5 OFFSET ${off}`;

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
User.categoryData = function(result){
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

// 서브 게시판 목록 불러오기
User.subBoardData = function(mainId, subId, result){
    let query = "SELECT idx, image, title, content, date_format(regdate, '%Y-%m-%d %H:%i:%s') regdate," 
                + "date_format(modidate, '%Y-%m-%d %H:%i:%s') modidate, main_id, sub_id FROM board WHERE main_id = ? and sub_id = ?";

    conn.query(query, [mainId, subId], function(err, res){
        if(err){
         result(null, err);
        } else {
            console.log(res);
            result(null, res);
        }
    });
};

// 게시판 글 읽기
User.boardRead = function(idx, mainId, subId, result){
    let select = "SELECT * FROM board WHERE idx = ? AND main_id = ? AND sub_id = ?;";
    conn.query(select, [idx, mainId, subId], function(err, res){
        if(err){
            result(null, err);
        } else {
            result(null, res)
        }
    });
}


module.exports = User;

