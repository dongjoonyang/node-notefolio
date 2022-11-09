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

        // 삭제 버튼 data
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
                // $.ajax({
                //     type : "get",
                //     url : "/admin/manage/main/" + mainId + "/sub/" + subId + "/page/" + 1,
                //     dataType : "JSON",
                // })
                // .done(function(json){
                //     console.log("서브 카테 게시글 불러오기 json:"+json);
                //     boardList(json, mainId, subId);
                // })
                // .fail(function(request, status, error){
                //     console.log("삭제 후 서브 카테고리 게시판 목록 불러오기 Ajax failed");
                // });

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