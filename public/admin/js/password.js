$(function() {
    /**
     * =======================================
     * 설  명 : 비밀번호 힌트 확인 버튼 클릭
     * =======================================
     */
    $("#hintBtn").on("click", function(e){
        let passHint = $("input[name=passwordHint]").val();
        $.ajax({
            url : "/admin/passwordProcess",
            type : "POST",
            dataType : "JSON",
            data : {"passwordHint" : passHint}
        })

        .done(function(json){
            if(json.flag){
                $(".password-check").text(json.password);
            } else {
                alert("비밀번호 힌트의 값이 틀렸습니다.");
                $(".password-check").text("비밀번호 힌트를 재입력 하세요");
            }
        })

        .fail(function(xhr, status, errorThrown){
            console.log("Ajax failed")
        })
    });
});

