/**
* =======================================
* 설  명 : 데이터베이스 Mysql
* =======================================
*/
const db_config = require('../../config/mysql');
const conn = db_config.init();
db_config.connect(conn);

let Board = function (){}; // 생성자

// 게시판 글 등록
Board.boardAddProcess = function(imgurl, mainId, subId, title, contents, result){
    let insert = "INSERT INTO board (image, title, content, regdate, modidate, main_id, sub_id) values(?,?,?,now(),now(),?,?);";

    conn.query(insert, [imgurl, title, contents, mainId, subId], function(err, res){
        if(err){
            result(null, err);
        } else {
            result(null, res);
        }
    });
};

// 게시판 글 읽기
Board.boardRead = function(idx, mainId, subId, result){
    let select = "SELECT * FROM board WHERE idx = ? AND main_id = ? AND sub_id = ?;";
    conn.query(select, [idx, mainId, subId], function(err, res){
        if(err){
            result(null, err);
        } else {
            result(null, res)
        }
    });
}

// 게시판 글 수정
Board.boardUpdateProcess = function(idx, imgurl, mainId, subId, title, contents, result){
    let datas = [imgurl, title, contents, idx, mainId, subId];
    
    let update = "UPDATE board set image=?, title=?, content=?, modidate=now() where idx=? and main_Id=? and sub_Id=?;";
    
    conn.query(update, datas, function(err, res){
        if(err){
            result(null, err);
        } else {
            result(null, res);
        }
    })
}

// 게시판 글 메인 삭제
Board.boardDelete = function(idxArr, queryStr, result){
    let datas = idxArr;
    let questionMark = queryStr;

    let del = "DELETE FROM board where idx in (" + questionMark + ");";

    conn.query(del, datas, function(err, res){
        if(err){
            result(null, err);
        } else {
            result(null, res);
        }
    })
}

module.exports = Board;