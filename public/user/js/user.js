/**
* =======================================
* 설  명 : 프로필 화면
* =======================================
*/
function fnProfileInitList(){
    $("#note").addClass("display-none");

    let profile = '';
    profile += "<h1>양반김 프로필</h1>";
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

            // 서브 카테고리
            if(!selfAcive){
                $("#mainCategory li a").removeClass("active");
                $(this).addClass("active");
            }

            /* 프로필 숨김 및 리스트 숨김 해지 */
            $("#profile").addClass("display-none");
            $("#note").removeClass("display-none");  

            let mainId = $(this).data('mainId');
            fnMainCategory(mainId);
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
function fnMainCategory(mainId){
    if(mainId != undefined){
        $.ajax({
            type : "get",
            url : "/" + mainId,
            dataType : "JSON"
        })
        .done(function(json){
            fnNoteCate(json);
            fnNoteList(json);
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
        notefolioCate += "<li><a href='javascript:;' class='active' data-main-id=" + json.mainId + "  data-page=" + 1 + ">Project ALL</a></li>";
    }else{
        notefolioCate += "<li><a href='javascript:;' class='active' data-main-id=" + json.mainId + "  data-page=" + 1 + ">Artwork ALL</a></li>";
    }

    /* 서브 카테고리 */
    for(i = 0; i < json.rows2.length ; i++){
        let data = json.rows2[i];
        if(data.main_id == json.mainId){
            notefolioCate += "<li><a href='javascript:;' data-main-id=" + data.main_id + "  data-sub-id=" + data.sub_id + "  data-page=" + 1 + ">" + data.sub_title + "</a></li>";
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
    $("#noteList").empty(); // 리스트 비우기

    /* 전체 리스트 데이터 추출 */
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

    $("#noteList").append(notefolio);
}

/**
* =======================================
* 설  명 : 바닥 감지 이벤트
* =======================================
*/
// function fnInfinityScroll() {
//     console.log("ok");
//     let flag = true;
//      $(document).on("scroll", function(){
//         let mainId = $("#subCategory .active").data("mainId");
//         let subId = $("#subCategory .active").data("subId");
//         let page = $("#subCategory .active").data("page");
        
//         if($(window).scrollTop() + $(window).height() == $(document).height()) {    
//             if(flag == true){
//                 if(subId == undefined){ // All click
//                     $.ajax({
//                         type : "get",
//                         url : "/" + mainId + "/page/" + (page = page + 1),
//                         dataType : "JSON",
//                     })
//                     .done(function(json){
//                         fnNoteList(json);
//                         fnNoteListPage(json, mainId);
//                     })
//                     .fail(function(request, status, error){
//                         console.log("페이징 불러오기 Ajax failed");
//                     });
                    
//                 }else{
//                     $.ajax({
//                         type : "get",
//                         url : "/main/" + mainId + "/sub/" + subId + "/page/" + page,
//                         dataType : "JSON"
//                     })
//                     .done(function(json){
//                         fnNoteList(json);
//                         fnNoteListPage(json, mainId, subId);
//                     })
//                     .fail(function(xhr, status, errorThrown){
//                         console.log("서브 게시판 및 카테고리 Ajax failed")
//                     });
//                 }
//                 flag = false;
//             }
//         }
//     });
// }


$(function() {
    fnCategoryInitList(); // 상단 헤더
    fnProfileInitList(); // 프로필 화면
    //fnInfinityScroll(); // 바닥감지 이벤트
   
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

        if(subId == undefined){ 
            $.ajax({
                type : "get",
                url : "/" + mainId,
                dataType : "JSON"
            })
            .done(function(json){
                fnNoteList(json);
            })
            .fail(function(xhr, status, errorThrown){
                console.log("메인 게시판 및 카테고리 Ajax failed")
            });
        }else{
            $.ajax({
                type : "get",
                url : "/main/" + mainId + "/sub/" + subId,
                dataType : "JSON"
            })
            .done(function(json){
                fnNoteList(json);
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
