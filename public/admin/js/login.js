 /**
 * =======================================
 * 설  명 : 쿠키 함수
 * =======================================
 */
function setCookie(cookieName, value, exdays){
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var cookieValue = escape(value) + ((exdays==null) ? "" : "; expires=" + exdate.toGMTString());
    document.cookie = cookieName + "=" + cookieValue;
}
 
function deleteCookie(cookieName){
    var expireDate = new Date();
    expireDate.setDate(expireDate.getDate() - 1);
    document.cookie = cookieName + "= " + "; expires=" + expireDate.toGMTString();
}
 
function getCookie(cookieName) {
    cookieName = cookieName + '=';
    var cookieData = document.cookie;
    var start = cookieData.indexOf(cookieName);
    var cookieValue = '';
    if(start != -1){
        start += cookieName.length;
        var end = cookieData.indexOf(';', start);
        if(end == -1)end = cookieData.length;
        cookieValue = cookieData.substring(start, end);
    }
    return unescape(cookieValue);
}

$(function() {
    /**
     * =======================================
     * 설  명 : 쿠키 요청
     * =======================================
     */
    let authorId = getCookie("authorId");
    $("#loginForm input[name='id']").val(authorId);

    if($("#loginForm input[name='id']").val() != ""){ 
        $("#loginChk").attr("checked", true);
    }
    
    /**
     * =======================================
     * 설  명 : 아이디 기억하기 쿠키
     * =======================================
     */
    $("#loginChk").change(function(){ 
        if($("#loginChk").is(":checked")){
            let authorId = $("input[name='id']").val();
            setCookie("authorId", authorId, 7);
        }else{ 
            deleteCookie("authorId");
        }
    });

    /**
     * =======================================
     * 설  명 : 로그인
     * =======================================
     */
    let loginForm = $("#loginForm").validate({
        rules: {
            id: {
                required: true
            },
            password: {
                required: true,
                password: true
            }
        },
        messages: {
            id: {
                required: "필수 항목입니다."
            },
            password: {
                required: "필수 항목입니다."
            }
		},
		submitHandler: function(form) {
            // ID 저장하기를 체크한 상태
            if($("#loginChk").is(":checked")){
                let authorId = $("input[name='id']").val();
                setCookie("authorId", authorId, 7);
            }
            
            $("#loginForm").unbind("submit").submit(); 
		}
    });

});

