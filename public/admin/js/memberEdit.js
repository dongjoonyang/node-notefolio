$(function() {
    /**
     * =======================================
     * 설  명 : 패스워드 변경
     * =======================================
     */
    let modifyForm = $("#modifyForm").validate({
        rules: {
            newPassword: {
                password: true
            },
            newPasswordConfirm: {
                password: false,
                equalTo: "#newPasswordInput"
            }
        },
        messages: {
            newPasswordConfirm: {
                equalTo: "새 비밀번호와 일치하지 않습니다."
            }
		},
		submitHandler: function(form) {
            let newPasswordVal = $("input[name='newPassword']").val();
            if(newPasswordVal != ''){
                $("#modifyForm").unbind("submit").submit(); 
            } else {
                alert("새 비밀번호를 입력해 주세요.");
                $("#newPasswordInput").focus();
            }
		}
    });
});

