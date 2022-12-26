/**
 * =======================================
 * 설  명 : 카테고리 매니저 카테고리 리스트 호출
 * =======================================
 */
function fnCategoryInitList(){
    // 카테고리 매니저 목록
    $(".mng-category__all").remove();
    $(".mng-category__list").remove();

    if($(".mng-category__all").length === 0 && $(".mng-category__list").length === 0){
        $.ajax({
            type : "get",
            url : "/admin/manage/category/data",
            dataType : "JSON"
        })
        .done(function(json){
            // 카테고리 매니저 리스트 호출
            fnCategoryManageList(json);
            mainCategory();
            subCategory();
        })
        .fail(function(xhr, status, errorThrown){
            console.log("카테고리 매니저 Ajax failed")
        });
    }
};

/**
 * =======================================
 * 설  명 : 카테고리 매니저 카테고리 리스트 출력
 * =======================================
 */
 function fnCategoryManageList(json){
    let info = '';
    for(i = 0; i < json.rows1.length ; i++){
        let data = json.rows1[i];
        info += "<div class='mng-category__all'>";
        info += "<a href='javascript:;' data-main-id=" + data.main_id +" class=" + (data.main_id == 1 ? "active" : "") + ">" + data.main_title +"</a>";
        info += "</div>"

        info += "<ul class='mng-category__list'>"
        if(data.main_id === 1){
            for(let j = 0; j < json.rows2.length; j++) {
                let data2 = json.rows2[j];
                if(data2.main_id === 1){
                    info += "<li>";
                    info += "<a href='javascript:;' id='pr"+ data2.sub_id +"' data-main-id=" + data2.main_id +" data-sub-id=" + data2.sub_id + ">" + data2.sub_title + "</a>";
                    info += "</li>";
                }
            }   
            info += "</ul>"
        }else{
            for(let k = 0; k < json.rows2.length; k++) {
                let data3 = json.rows2[k];
                if(data3.main_id === 2){
                    info += "<li>";
                    info += "<a href='javascript:;' id='ar"+ data3.sub_id +"' data-main-id=" + data3.main_id +" data-sub-id=" + data3.sub_id + ">" + data3.sub_title + "</a>";
                    info += "</li>";
                }
            }
        }
    };
    $(".mng-category").append(info);
};

/**
 * =======================================
 * 설  명 : 카테고리 팝업 리스트 함수
 * =======================================
 */
function fnCategoryPopList(){
    $.ajax({
        type : "get",
        url : "/admin/manage/category/data",
        dataType : "JSON",
    })
    .done(function(json){
        $(".modal__generate_new").remove();
        $(".modal__tree--item").remove();
        $("#categoryNameInput").attr("readonly", true);
        $("#categoryNameInput").val("");

        if($(".modal__tree--item").length === 0){
            _.forEach(json.rows2, function (val, key) {
                let info = '';
                
                info += "<li data-value=" + val.sub_id + " class='modal__tree--item " + (val.main_id === 1 ? "category1" : "category2") + "'>";
                info += "<span>" + val.sub_title + "</span>";
                info += "<button type='button' class='category-item-del'>X</button>";
                info += "</li>";

                $(".modal__tree--list").append(info);
            });
        }
        
        // 카테고리 리스트 선택
        $(".modal__tree--item").on("click", function(){
            let subId = $(this).data('value');

            $(".modal__tree--item").removeClass("on");
            $(this).addClass("on");
            $(".modal__generate--item").removeClass("on");
            
            // subID 텍스트 히든태그
            $("#categorySubIdInput").val(subId);
            $("#categoryNameInput").prop("readonly", false);
            $(".modal__mod--kinds").addClass("display-none");

            // 카테고리 이름
            let = categoryName = $(this).find('span').text();
            $("#categoryNameInput").val(categoryName);
            $("#categoryNameInput").focus();
        });

        // 새 카테고리 추가
        $("#categoryNewBtn").on("click", function(){
            $(".modal__tree--item").removeClass("on");
            $(".modal__mod--kinds").removeClass("display-none");
            $(".modal__generate--item").addClass("on");
            $("#categoryNameInput").focus();
            $("#categorySubIdInput").val("");
            $("#categoryNameInput").val("");

            if ($("#categoryNewItem")[0] === undefined) {                
                $(".modal__generate")[0].innerHTML 
                    += '<div class="modal__generate_new"><span id="categoryNewItem" class="modal__generate--item on">New Category</span><button type="button" class="generate-item-del">X</button></div>'

                $("#categoryNameInput").prop("readonly", false);
                $("#categoryNameInput").val("");
                $("#categoryNameInput").focus();
            }

            // 새 카테고리 클릭
            $(".modal__generate_new").on("click", function(){
                $(".modal__generate--item").addClass("on");
                $(".modal__mod--kinds").removeClass("display-none");
                $(".modal__tree--item").removeClass("on");

                $("#categorySubIdInput").val("");
                $("#categoryNameInput").val("");
                $("#categoryNameInput").focus();
            })

            // 새 카테고리 삭제
            $(".generate-item-del").on("click", function(){
                $(".modal__generate_new").remove();
            })
        });

         // 카테고리 삭제
         $(".category-item-del").on("click", function(){
            let subId = $(this).parent().data('value');
            let flag = window.confirm("삭제 하시겠습니까?");

            if(flag){
                $.ajax({
                    type : "DELETE",
                    url : "/admin/manage/category/" + subId,
                })
                .done(function(result){
                    
                    if(JSON.stringify(result.errno) == "1451"){ // 에러 메시지 외래키 삭제시 에러 코드
                        alert("카테고리 안에 게시글 먼저 삭제해 주세요.");
                    } else {
                        alert("삭제 하였습니다.");

                        fnCategoryPopList();
                        fnCategoryInitList();
                    }

                })
                .fail(function(xhr, status, errorThrown){
                    console.log("카테고리 삭제 Ajax failed")
                })
            }
        });
    })
    .fail(function(request,status,error){
        console.log(request, status, error);
    });
}

/**
 * =======================================
 * 설  명 : 메인 카테고리 클릭 함수
 * =======================================
 */
function mainCategory(){
    $(".mng-category__all a").on("click", function(){
        let self = $(this).hasClass("active");
        let element = $(".mng-category__all a");
        let elementAnother = $(".mng-category__list li a");
        let manageBtn = $("#boardAddBtn");
        let mainId = $(this).data("mainId");
        
        if(!self){
            manageBtn.addClass("display-none");
            elementAnother.removeClass("active");
            element.removeClass("active");
            $(this).addClass("active");
        }

        // url 초기화 : 해시 제거
        changeUrl("","1");

        // 삭제 버튼 Main category Id 값 추가 | Sub category Id 값 삭제
        $("#boardDelBtn").attr("data-main-id", mainId);
        $("#boardDelBtn").attr("data-sub-id", "");

        // 진행
        $.ajax({
            type : "get",
            url : "/admin/manage/main/" + mainId + "/page/" + 1,
            dataType : "JSON",
        })
        .done(function(json){
            boardList(json, mainId);

            // 메인 게시판 삭제
            $("#boardDelBtn").unbind("click");
            $("#boardDelBtn").on("click", function(){
                if($("input[name='boardChk[]']:checked").is(':checked')){
                    let chkArray = new Array();
                    let chkCount = $("input[name='boardChk[]']:checked").length;
                    let flag = window.confirm(chkCount + "건이 삭제됩니다. 확인해주세요.");
        
                    if(flag){
                        $("input[name='boardChk[]']:checked").each(function(){
                            let tmpVal = $(this).val();
                            chkArray.push(tmpVal);
                        });
        
                        $.ajax({
                            type : "get",
                            url : "/admin/board/boardDelete/" + chkArray
                        })
                        .done(function(result){
                            alert("삭제 되었습니다.");
                            $.ajax({
                                type : "get",
                                url : "/admin/manage/main/" + mainId + "/page/" + 1,
                                dataType : "JSON",
                            })
                            .done(function(json){
                                boardList(json, mainId);
                            })
                            .fail(function(request, status, error){
                                console.log("삭제 후 서브 카테고리 게시판 목록 불러오기 Ajax failed");
                            });
                            
                        })
                        .fail(function(xhr, status, errorThrown){
                            console.log("게시판 삭제 Ajax failed")
                        })
                    }
                }else{
                    alert("항목을 선택해주세요.");
                }
            });
        })
        .fail(function(request, status, error){
            console.log("메인 카테고리 게시판 목록 불러오기 Ajax failed");
        });
    });
}
/**
 * =======================================
 * 설  명 : 서브 카테고리 클릭 함수
 * =======================================
 */
function subCategory(){
    $(".mng-category__list li a").on("click", function(){
        let selfAcive = $(this).hasClass("active");
        let element = $(".mng-category__all a");
        let elementAnother = $(".mng-category__list li a");
        let manageAddBtn = $("#boardAddBtn");
        let manageDelBtn = $("#boardDelBtn");
        let mainId = $(this).data("mainId");
        let subId = $(this).data("subId");
        let flag = "";

        if(!selfAcive){
            manageAddBtn.removeClass("display-none");
            manageDelBtn.removeClass("display-none");
            elementAnother.removeClass("active");
            element.removeClass("active");
            $(this).addClass("active");
            $("#boardAddBtn").attr("href", "/admin/board/boardAdd/" + mainId + "/" + subId);
        }

        // 삭제 버튼 Main category Id | Sub category Id 값 추가 
        $("#boardDelBtn").attr("data-main-id", mainId);
        $("#boardDelBtn").attr("data-sub-id", subId);

        $.ajax({
            type : "get",
            url : "/admin/manage/main/" + mainId + "/sub/" + subId + "/page/" + 1,
            dataType : "JSON",
        })
        .done(function(json){
            boardList(json, mainId, subId);

            // 서브 게시판 삭제
            $("#boardDelBtn").unbind("click");
            $("#boardDelBtn").on("click", function(){
                if($("input[name='boardChk[]']:checked").is(':checked')){
                    let chkArray = new Array();
                    let chkCount = $("input[name='boardChk[]']:checked").length;
                    let flag = window.confirm(chkCount + "건이 삭제됩니다. 확인해주세요.");
        
                    if(flag){
                        $("input[name='boardChk[]']:checked").each(function(){
                            let tmpVal = $(this).val();
                            chkArray.push(tmpVal);
                        });
        
                        $.ajax({
                            type : "get",
                            url : "/admin/board/boardDelete/" + chkArray
                        })
                        .done(function(result){
                            alert("삭제 되었습니다.");
                            $.ajax({
                                type : "get",
                                url : "/admin/manage/main/" + mainId + "/sub/" + subId + "/page/" + 1,
                                dataType : "JSON",
                            })
                            .done(function(json){
                                boardList(json, mainId, subId);
                            })
                            .fail(function(request, status, error){
                                console.log("삭제 후 서브 카테고리 게시판 목록 불러오기 Ajax failed");
                            });
                            
                        })
                        .fail(function(xhr, status, errorThrown){
                            console.log("게시판 삭제 Ajax failed")
                        })
                    }
                }else{
                    alert("항목을 선택해주세요.");
                }
            });

        })
        .fail(function(request, status, error){
            console.log("서브 카테고리 게시판 목록 불러오기 Ajax failed");
        });
        // url 초기화 : 해시 제거
        changeUrl("","1");
    });
}

/**
 * =======================================
 * 설  명 : 게시판 리스트 목록
 * =======================================
 */
function boardList(json, mainId, subId){
    let chkAllBox = "";
    let chkBox = "";
    let listHtml = "";
    let boardAddBtn = "";
    let pageHtml = "";
    let url = location.origin;
    
    if(json.rows != ''){
        $(".mng__table .card").removeClass("display-none");
        $(".pagination").removeClass("display-none");
        $(".mng__empty").addClass("display-none");
        $("#boardDelBtn").removeClass("display-none");

        // 전체 체크 초기화
        if ($("#boardAllChk").is(':checked')) {
            $("input[type=checkbox]").prop("checked", false);
        }
        
        if(json.category === "sub"){
            boardAddBtn += "<a href='javascript:;' id='boardAddBtn' class='btn btn-simple'><i class='fas fa-plus'></i></a>";
            if(!$("#boardAddBtn").is("#boardAddBtn")){
                $(".mng__btn").prepend(boardAddBtn);
                $("#boardAddBtn").attr("href", "/admin/board/boardAdd/" + mainId + "/" + subId);
            }
        }

        // 테이블 초기화
        $(".mng__table table tbody").empty();
        // 페이징 초기화
        $(".pagination").empty();

        chkAllBox += "<th scope='col' class='item-box-chk'><input type='checkbox' id='boardAllChk'></th>";

        if(!$("#boardAllChk").is("#boardAllChk")){
            $(".mng__table--box thead tr").prepend(chkAllBox);
        }
        
        //console.log("mainId :" + mainId + "||" + "subId : " + subId);
        for(var i = (json.page * json.page_num) - json.page_num; i < (json.page * json.page_num); i++) {
            if(i > json.length){
                i++;
            }else{
                let data = json.rows[i];
                listHtml += "<tr class='mng__table--main'>";
                listHtml += "<td class='mng__table--center item-box-chk'><input type='checkbox' name='boardChk[]' id='itemChk' value='" + data.idx + "'/></td>";    
                listHtml += "<td class='mng__table--center'>" + data.idx + "</td>";
                listHtml += "<td class='mng__table--center'><a href='/admin/board/boardRead/" + data.idx + "/" + data.main_id + "/" + data.sub_id +"'>";
                listHtml += "<img src='"+ data.image + "' class='mng__table--thumb'/></a></td>";
                listHtml += "<td class='mng__table--center'>" + data.title + "</td>";
                listHtml += "<td class='mng__table--center'>"+ data.regdate +"</td>";
                listHtml += "<td class='mng__table--center'>"+ data.modidate +"</td>";
                listHtml += "<td class='mng__table--center'>"+ (data.main_id == 1 ? "Project" : "Artwork") + "</td>";
                listHtml += "<td class='mng__table--center'>"+ data.sub_id +"</td>";
                listHtml += "</tr>"
            } 
        };
        $(".mng__table table tbody").append(listHtml);   
         // 페이징
        for(let i = 0; i < json.rows.length / json.page_num; i++){
            let data = json.rows[i];
            pageHtml += "<li class='" + (json.page == i+1 ? 'active' : '') + "'>";
           
            if(mainId != "" && (subId != "" && subId != undefined)){
                //sub category
                pageHtml += "<a href='javascript:;' data-main-id='"+ data.main_id +"' data-sub-id='"+ data.sub_id +"' data-page='" + (i + 1) + "'>" + (i + 1) + "</a>";
            }else{
                //main category
                pageHtml += "<a href='javascript:;' data-main-id='"+ data.main_id +"' data-page='" + (i + 1) + "'>" + (i + 1) + "</a>";
            }

            pageHtml += "</li>";
        }   
        $(".pagination").append(pageHtml);

        // 페이징 클릭
        $(".pagination li a").on("click", function(){
            let mainId = $(this).data("mainId");
            let subId = $(this).data("subId");
            let page = $(this).data("page");

            if(mainId != "" && (subId != "" && subId != undefined)){
                // sub category
                $.ajax({
                    type : "get",
                    url : "/admin/manage/main/" + mainId + "/sub/"+ subId +"/page/" + page,
                    dataType : "JSON",
                })
                .done(function(json){
                    boardList(json, mainId, subId);
                })
                .fail(function(request, status, error){
                    console.log("서브 페이징 게시판 목록 불러오기 Ajax failed");
                });
            }else{
                // main category
                $.ajax({
                    type : "get",
                    url : "/admin/manage/main/" + mainId + "/page/" + page,
                    dataType : "JSON",
                })
                .done(function(json){
                    boardList(json, mainId);
                })
                .fail(function(request, status, error){
                    console.log("메인 페이징 게시판 목록 불러오기 Ajax failed");
                });
            }
        });
    }else{
        $(".mng__table .card").addClass("display-none");
        $(".pagination").addClass("display-none");
        $(".mng__empty").removeClass("display-none");
        $("#boardDelBtn").addClass("display-none");
        if(json.category === "sub"){
            boardAddBtn += "<a href='javascript:;' id='boardAddBtn' class='btn btn-simple'><i class='fas fa-plus'></i></a>";
            if(!$("#boardAddBtn").is("#boardAddBtn")){
                $(".mng__btn").prepend(boardAddBtn);
            }
        }
    }
    
    /* 전체 체크 */
    allChk();
}

/**
 * =======================================
 * 설  명 : 전체 체크
 * =======================================
 */
function allChk(){
    let boardAllChk = $("#boardAllChk");
    boardAllChk.change(function(){
        let self = $(this);
        
        let checked = self.prop("checked");
        $("input[name='boardChk[]']").prop('checked', checked);
    });

    let boardChk = $('input[name="boardChk[]"]');
    boardChk.change(function () {
        let boardChkLength = boardChk.length;
        let checkedLength = $('input[name="boardChk[]"]:checked').length;
        let selectAll = (boardChkLength == checkedLength);

        boardAllChk.prop('checked', selectAll);
    });
}
/**
 * =======================================
 * 설  명 : url 초기화
 * =======================================
 */
function changeUrl(title, url, state) {
    if (typeof (history.pushState) != "undefined") { //브라우저가 지원하는 경우
        history.pushState(state, title, url);
    }
    else {
        location.href = url; //브라우저가 지원하지 않는 경우 페이지 이동처리
    }
}


$(function() {
    /**
     * =======================================
     * 설  명 : Init 초기화
     * =======================================
     */
    if($(".mng__table--main").length === 0){
        $(".mng__table .card").addClass("display-none");
        $("#boardAddBtn").addClass("display-none");
        $(".mng__empty").removeClass("display-none");
    }else{
        $(".mng__table .card").removeClass("display-none");
        $("#boardDelBtn").removeClass("display-none");
        $(".mng__empty").addClass("display-none");
    }
 
    /**
     * =======================================
     * 설  명 : 메인 카테고리 클릭 호출
     * =======================================
     */
    mainCategory();
    /**
     * =======================================
     * 설  명 : 서브 카테고리 클릭 호출
     * =======================================
     */
    subCategory();

    /**
     * =======================================
     * 설  명 : 전체체크
     * =======================================
     */
     allChk();

    /**
     * =======================================
     * 설  명 : 카테고리 팝업 오픈
     * =======================================
     */
    $("#categoryBtn").on("click", function(){
        $(".modal").removeClass("display-none");
        // 초기화
        $(".modal__tree--item").removeClass("on");
        $("#categoryNewItem").remove();
        $("#categoryNameInput").attr("readonly", true);

        fnCategoryPopList();
    });
    
    /**
     * =======================================
     * 설  명 : 카테고리 팝업 닫기
     * =======================================
    */
    $("#cancelBtn").on("click", function(){
        $(".modal").addClass("display-none");        
    });

    /**
     * =======================================
     * 설  명 : 카테고리 팝업 아이템 추가 등록
     * =======================================
     */
    $("#confirmBtn").on("click", function(){
        let categoryForm = $("#categoryForm").validate({
            rules: {
                categoryName: {
                    required: true
                },
            },
            messages: {
                categoryName: {
                    required: "필수 항목입니다."
                }
            },
            submitHandler: function(form) {
                let subIdVal = $("#categorySubIdInput").val();
                let parameter = $("#categoryForm").serializeObject();                
                
                // ajax type parameter 가지고와서
                //-> url -> route -> controller -> model -> ajax 
                if(subIdVal !== ""){
                    // update
                    $.ajax({
                        type : "POST",
                        url : "/admin/manage/manageCategoryUpdateProcess",
                        dataType : "JSON",
                        data : parameter
                    })
                    .done(function(json){
                        alert("수정되었습니다.");

                        // 카테고리 리스트 호출
                        fnCategoryPopList();
                        fnCategoryInitList();
                    })
                    .fail(function(xhr, status, errorThrown){
                        console.log("카테고리 수정 Ajax failed")
                    })

                } else {
                    // insert
                    $.ajax({
                        type : "POST",
                        url : "/admin/manage/manageCategoryProcess",
                        dataType : "JSON",
                        data : parameter
                    })
                    .done(function(json){
                        alert("등록하였습니다.");

                        // 카테고리 리스트 호출
                        fnCategoryPopList();
                        fnCategoryInitList();
                    })
                    .fail(function(xhr, status, errorThrown){
                        console.log("카테고리 등록 Ajax failed")
                    })
                }
            }
        });            
    });
    

    /**
     * =======================================
     * 설  명 : 글 삭제
     * =======================================
     */
    
    $("#boardDelBtn").on("click", function(){
        if($("input[name='boardChk[]']:checked").is(':checked')){
            let chkArray = new Array();
            let chkCount = $("input[name='boardChk[]']:checked").length;
            let flag = window.confirm(chkCount + "건이 삭제됩니다. 확인해주세요.");
            let urlChange = "";

            let mainId = $(this).data("mainId");
            let subId = $(this).data("subId");

            if(flag){
                $("input[name='boardChk[]']:checked").each(function(){
                    let tmpVal = $(this).val();
                    chkArray.push(tmpVal);
                });

                $.ajax({
                    type : "get",
                    url : "/admin/board/boardDelete/" + chkArray
                })
                .done(function(result){
                    alert("삭제 되었습니다.");
                    $.ajax({
                        type : "get",
                        url : "/admin/manage/main/" + mainId + "/page/" + 1,
                        dataType : "JSON",
                    })
                    .done(function(json){
                        console.log("메인 카테 게시글 불러오기 json:"+json);
                        boardList(json, mainId);
                    })
                    .fail(function(request, status, error){
                        console.log("삭제 후 메인 카테고리 게시판 목록 불러오기 Ajax failed");
                    });
                    
                })
                .fail(function(xhr, status, errorThrown){
                    console.log("게시판 삭제 Ajax failed")
                })
            }
        }else{
            alert("항목을 선택해주세요.");
        }
    });
    

    /**
     * =======================================
     * 설  명 : 페이징 클릭 호출(정적)
     * =======================================
     */
    $(".pagination li a").on("click", function(){
        let mainId = $(this).data("mainId");
        let page = $(this).data("page");

        $.ajax({
            type : "get",
            url : "/admin/manage/main/" + mainId + "/page/" + page,
            dataType : "JSON",
        })
        .done(function(json){
            boardList(json, mainId);
        })
        .fail(function(request, status, error){
            console.log("페이징 게시판 목록 불러오기 Ajax failed");
        });
    });

    /**
     * =======================================
     * 설  명 : 글 등록 후 페이지 이동 탭 활성화
     * =======================================
     */
    let link = document.location.href;
    if(link.includes("#")){
        let tab = link.split("#").pop();

        if(tab != ""){
            $("#"+ tab).trigger("click");
        }
    }

    /**
     * =======================================
     * 설  명 : 테이블 순번(인덱스) 초기화
     * =======================================
     */
    $("#boardNumResetBtn").on("click", function(){
        let result = confirm("순번을 초기화 하시겠습니까? \n초기화 하여도 데이터가 삭제되거나 하지 않습니다. \n!중요! 순서의 불변함을 위해 모든 데이터가 삭제 후 초기화 하시는걸 추천 드립니다. \n초기화 후 새로고침을 해야 적용됩니다.");
        if(result){
            $.ajax({
                type : "put",
                url : "/admin/manage/update",
            })
        }
    });
});

