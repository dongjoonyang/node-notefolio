/**
* =======================================
* 설  명 : 데이터베이스 Mysql
* =======================================
*/
const db_config = require('../../config/mysql');
const conn = db_config.init();
db_config.connect(conn);

let Author = function (){}; // 생성자

// 로그인 쿼리
Author.login = function(id, password, result){
  conn.query("SELECT * FROM author WHERE id = ? AND password = ?", [id, password], function (err, res) {
    if(err){
      result(null, err);
    } else {
      result(null, res);
    }
  });
};

// 비밀번호 찾기 쿼리
Author.password = function(result){
  conn.query("SELECT * FROM AUTHOR", function (err, res) {
    if(err){
      result(null, err);
    } else {
      result(null, res);
    }
  });
};

// 회원정보 수정 쿼리
Author.memberEdit = function(id, newPassword, result){
  conn.query("UPDATE author SET password = ? WHERE id= ?", [newPassword, id],function (err, res, fields) {
    if (err) {
      throw err
    } else {
      result(null, res);
    }
  });
}

module.exports = Author;