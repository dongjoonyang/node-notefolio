/**
* =======================================
* 설  명 : 프로필 화면
* =======================================
*/
function fnProfileInitList(){
    $("#note").addClass("display-none");

    let profile = '';
    profile += "<h1>양반김 프로필 :::::: 프로필 화면입니다.</h1>";
    // profile += "<img src='/images/bg.jpg'>";
    $("#profile").append(profile);
}
/**
* =======================================
* 설  명 : 네비게이션 헤더
* =======================================
*/
function fnCategoryInitList(){
    $.ajax({
        type : "get",
        url : "/category/data",
        dataType : "JSON"
    })
    .done(function(json){
        let info = '';
        info += "<li><a href='/' class='active'>프로필</a></li>";
        for(i = 0; i < json.rows1.length ; i++){
            let data = json.rows1[i];
            info += "<li><a href='javascript:;' data-main-id='" + data.main_id + "'>"+ data.main_title +"</a></li>";
        };
        $("#mainCategory").append(info);

        /* 포트폴리오 메뉴 */
        $("#mainCategory li a").on("click", function(){     
            let selfAcive = $(this).hasClass("active");
            $("#noteList").empty(); // 리스트 비우기

            // 서브 카테고리
            if(!selfAcive){
                $("#mainCategory li a").removeClass("active");
                $(this).addClass("active");
            }

            /* 프로필 숨김 및 리스트 숨김 해지 */
            $("#profile").addClass("display-none");
            $("#note").removeClass("display-none");  

            let mainId = $(this).data('mainId'); // 상단 카테고리
            let off = 0; // 받아올 데이터 시작 넘버
            fnMainCategory(mainId, off);
        });
    })
    .fail(function(xhr, status, errorThrown){
        console.log("카테고리 데이타 Ajax failed")
    });
    
}

/**
* =======================================
* 설  명 : 메뉴 클릭
* =======================================
*/
function fnMainCategory(mainId, off){
    if(mainId != undefined){
        $.ajax({
            type : "get",
            url : "/main/" + mainId + "/off/" + off,
            dataType : "JSON"
        })
        .done(function(json){
            fnNoteCate(json);
            fnNoteList(json); // 리스트 목록
            fnMainInfinityScroll(json); // 스크롤 시 데이터 호출
        })
        .fail(function(xhr, status, errorThrown){
            console.log("게시판 및 카테고리 Ajax failed")
        });
    }
}

/**
* =======================================
* 설  명 : 서브 카테고리
* =======================================
*/
function fnNoteCate(json){
    let notefolioCate= ""; // 카테고리
    $("#subCategory").empty(); // 카테고리 비우기
    
    if(json.mainId == 1){
        notefolioCate += "<li><a href='javascript:;' class='active' data-main-id=" + json.mainId + ">Project ALL</a></li>";
    }else{
        notefolioCate += "<li><a href='javascript:;' class='active' data-main-id=" + json.mainId + ">Artwork ALL</a></li>";
    }

    /* 서브 카테고리 */
    for(i = 0; i < json.rows2.length ; i++){
        let data = json.rows2[i];
        if(data.main_id == json.mainId){
            notefolioCate += "<li><a href='javascript:;' data-main-id=" + data.main_id + "  data-sub-id=" + data.sub_id + ">" + data.sub_title + "</a></li>";
        }
    };

    $("#subCategory").append(notefolioCate);
}

/**
* =======================================
* 설  명 : 서브 리스트
* =======================================
*/
function fnNoteList(json){
    let notefolio= ""; // 리스트   

    /* 전체 리스트 데이터 추출 */
    for(let i = 0; i <= json.rows3.length; i++){
        if(i > json.length){
            i++;
        }else{
            let data = json.rows3[i];
            notefolio += "<div class='note-item' data-idx=" + data.idx + " data-main-id=" + data.main_id + "  data-sub-id=" + data.sub_id + ">";
            notefolio += "<a href='javascript:;'>";
            notefolio += "<div class='note-img'>";
            notefolio += "<img src='"+ data.image +"'>";
            notefolio += "</div>";
            notefolio += "<div class='note-info'>";
            notefolio += "<p>"+ data.title +"</p>";
            notefolio += "</div>";
            notefolio += "</a>";
            notefolio += "</div>";
        }
    }

    $("#noteList").append(notefolio);
}

/**
* =======================================
* 설  명 : 바닥 감지 이벤트(All 카테고리)
* =======================================
*/
function fnMainInfinityScroll(json) {
    let mainId = $("#subCategory .active").data("mainId");

    $("#scroll-observer").show();

    const lastCardObserver = new IntersectionObserver(entries => {
        const lastCard = entries[0];

        if(!lastCard.isIntersecting) return;

        // 데이터 불러오기
        if(json.length !== -1) {
            off = json.off + 5;
            $.ajax({
                type : "get",
                url : "/main/" + mainId + "/off/" + off,
                dataType : "JSON",
            })
            .done(function(json){
                lastCardObserver.unobserve(lastCard.target);
                fnNoteList(json);
                fnMainInfinityScroll(json)
            })
            .fail(function(request, status, error){
                console.log("페이징 불러오기 Ajax failed");
            });
        } else {
            $("#scroll-observer").hide();
        }
        lastCardObserver.observe(document.querySelector('.note-item:last-child'));
        
    },{})

    lastCardObserver.observe(document.querySelector('.note-item:last-child'))
}

/**
* =======================================
* 설  명 : 바닥 감지 이벤트(Sub 카테고리)
* =======================================
*/
function fnSubInfinityScroll(json) {
    let mainId = $("#subCategory .active").data("mainId");
    let subId = $("#subCategory .active").data("subId");

    $("#scroll-observer").show();

    const lastCardObserver = new IntersectionObserver(entries => {
        const lastCard = entries[0];

        if(!lastCard.isIntersecting) return;

        // 데이터 불러오기
        if(json.length !== -1) {
            off = json.off + 5;
            $.ajax({
                type : "get",
                url : "/main/" + mainId + "/sub/" + subId + "/off/" + off,
                dataType : "JSON"
            })
            .done(function(json){
                lastCardObserver.unobserve(lastCard.target)
                fnNoteList(json);
                fnSubInfinityScroll(json); // 스크롤 시 데이터 호출
            })
            .fail(function(xhr, status, errorThrown){
                console.log("서브 게시판 및 카테고리 Ajax failed")
            });   
        } else {
            $("#scroll-observer").hide();
        }
        lastCardObserver.observe(document.querySelector('.note-item:last-child'))
    },{})

    lastCardObserver.observe(document.querySelector('.note-item:last-child'))
}


$(function() {
    fnCategoryInitList(); // 상단 헤더
    fnProfileInitList(); // 프로필 화면
   
    /**
    * =======================================
    * 설  명 : 서브 카테고리 클릭
    * =======================================
    */
    $(document).on("click", "#subCategory li a", function(){
        let mainId = $(this).data("mainId");
        let subId = $(this).data("subId");
        let selfAcive = $(this).hasClass("active");

        // 서브 카테고리
        if(!selfAcive){
            $("#subCategory li a").removeClass("active");
            $(this).addClass("active");
        }

        // 서브 목록 지우기
        $("#noteList").empty();

        if(subId == undefined){
            let off = 0; // offset 초기화
            $.ajax({
                type : "get",
                url : "/main/" + mainId + "/off/" + off,
                dataType : "JSON"
            })
            .done(function(json){
                fnNoteList(json);
                fnMainInfinityScroll(json); // 스크롤 시 데이터 호출
            })
            .fail(function(xhr, status, errorThrown){
                console.log("메인 게시판 및 카테고리 Ajax failed")
            });
        }else{
            let off = 0; // offset 초기화
            $.ajax({
                type : "get",
                url : "/main/" + mainId + "/sub/" + subId + "/off/" + off,
                dataType : "JSON"
            })
            .done(function(json){
                fnNoteList(json);
                fnSubInfinityScroll(json)
            })
            .fail(function(xhr, status, errorThrown){
                console.log("서브 게시판 및 카테고리 Ajax failed")
            });
        }
    })

    /**
    * =======================================
    * 설  명 : 팝업 오픈
    * =======================================
    */
    $(document).on("click", ".note-item", function(){
        $(".layer-n").css("display","block");
        $(".pop-area").empty();

        let idx = $(this).data("idx");
        let mainId = $(this).data("mainId");
        let subId = $(this).data("subId");

        $.ajax({
            type : "get",
            url : "/" + idx + "/" + mainId + "/" + subId,
            dataType : "JSON"
        })
        .done(function(json){
            /* 데이터 추출 */
            let notefolioData = "";
            notefolioData += json.rows[0].content;         
            $(".pop-area").append(notefolioData);

        })
        .fail(function(xhr, status, errorThrown){
            console.log("서브 게시판 및 카테고리 Ajax failed")
        });

    })

    /**
    * =======================================
    * 설  명 : 팝업 닫기
    * =======================================
    */
    $(".layer-n .bg, .layer-n .pop-close").on( "click", function(e) {
		$(this).closest(".layer-n").fadeOut();
	});
    
});
