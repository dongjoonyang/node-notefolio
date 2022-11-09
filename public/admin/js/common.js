/* 전역 상수 */
// const AJAX_MULTIPART_ENC_TYPE = "multipart/form-data",
// 	  AJAX_SUCCESS_CODE = "success",

/**
 * =======================================
 * 범 주 : 초기 세팅 함수
 * 설  명 : 셀렉트 디자인 커스텀
 * =======================================
 */
function fnValidateInit() {
    // 패스워드
    $.validator.addMethod("password", function(value, element) {
        return this.optional(element) || /[0-9]{1,6}$/.test(value);
    }, "숫자 1~6자리를 입력해주세요.");
}

/**
 * =======================================
 * 범 주 : 초기 세팅 함수
 * 설  명 : 왼쪽 네비 선택
 * =======================================
 */
function fnNavInit() {
    $(".nav__content--item").each(function() {
        let linkPage = $(this).children("a").attr("href");
        if(document.location.href.indexOf(linkPage) > 0) { 
            $(this).children("a").addClass('active');
        }
    });
}


/**
 * =======================================
 * 범 주 : 
 * 설  명 :
 * =======================================
 */
function fnGetInputTxtTrimForm(formVar) {
	$(formVar).find("input:text").each(function() {
        $(this).val($.trim($(this).val()));
	});

	return formVar;
}

/*
 * =======================================
 * 踰� 二� : 怨듯넻 - jQuery
 * ��  紐� : Form Serialize Object(JSON)�뺥깭 蹂��� �⑥닔
 * �묒꽦��/�묒꽦�� : 源��먮�/2021.01.19
 * =======================================
 */
$.fn.serializeObject = function() {
    let o = {};
    let a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || "");
        } else {
            o[this.name] = this.value || "";
        }
    });
    return o;
};



/**
 * =======================================
 * 범 주 : 초기 세팅 함수
 * 설  명 : 셀렉트 디자인 커스텀
 * =======================================
 */
 function fn() {
    /*
 	* =======================================
 	* 범 주 :  
 	* 설  명 : 
 	* =======================================
 	*/
}



/**
 * =======================================
 * 범 주 : 공통 - 초기 세팅 함수
 * 설  명 : jQuery Ajax 기본 설정
 * =======================================
 */
// function fnLayerOpenInit(set) {
//     $("#btn").on("click", function(){
//         $(".modal").css("display","block");
//     });
// }

$(function($){
    /* 초기 세팅 함수 실행 */
    //fnLayerOpenInit(); // 공통 팝업 오픈 이벤트 함수
    fnValidateInit(); // 유효성 검사
    fnNavInit(); // 
});