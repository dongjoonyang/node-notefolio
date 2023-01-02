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
 * 설  명 : 텍스트 빈칸 삭제
 * =======================================
 */
function fnGetInputTxtTrimForm(formVar) {
	$(formVar).find("input:text").each(function() {
        $(this).val($.trim($(this).val()));
	});

	return formVar;
}


/**
 * =======================================
 * 범 주 : Form Serialize Object(JSON)
 * 설  명 : json 객체 셋팅
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


$(function($){
    /* 초기 세팅 함수 실행 */    
    fnValidateInit(); // 유효성 검사
    fnNavInit(); // 

    /**
     * =======================================
     * 설  명 : 메뉴 접고/펼치기
     * =======================================
     */
     $("#sideMenuBtn").on("click", function(){
        let respon = $("nav").hasClass("respon");

        let width = $(window).width();
        let menuWidth = "1280";
        let menu = $("nav").hasClass("menu");
        
        if(!respon) {
            $("nav").addClass("respon");
            $(".toolbar").addClass("respon");
            $("main").addClass("respon");
        }else{
            $("nav").removeClass("respon");
            $(".toolbar").removeClass("respon");
            $("main").removeClass("respon");
        }

        if(width <= menuWidth) {
            if(!menu) {
                $("nav").addClass("menu");
                $(".toolbar__menu--btn").addClass("respon");
            }else{
                $("nav").removeClass("menu");
                $(".toolbar__menu--btn").removeClass("respon");
            }
        }
    })

    /**
     * =======================================
     * 설  명 : 리사이즈 모두 초기화
     * =======================================
     */
    $(window).resize(function(){
        let width = $(window).width();
        $("nav").removeClass("respon");
        $(".toolbar").removeClass("respon");
        $("main").removeClass("respon");
        $("nav").removeClass("menu");
        $(".toolbar__menu--btn").removeClass("respon");
    })
});