$(function() {
    /**
     * =======================================
     * 설  명 : 체크 박스 전체 선택
     * =======================================
     */
    const imageChk = $("input:checkbox[name='image']");
    const imageAllChk = $("input:checkbox[name='allChk']");

    imageAllChk.on("change", function() {
        let allChk = $(this).is(":checked");
           
        if(allChk) {
            imageChk.prop("checked", true);
        } else {
            imageChk.prop("checked", false);
        }
    });

    imageChk.on("change", function() {
        let imageChkRight = imageChk.is(":checked");
        let imageChkRightLength = $("input:checkbox[name='image']:checked").length;
        let imageChkBoxLength = imageChk.length;

        if(imageChkRightLength === imageChkBoxLength) {
            imageAllChk.prop("checked", true);
        } else {
            imageAllChk.prop("checked", false);
        }
    })

    /**
     * =======================================
     * 설  명 : 이미지 uload 삭제 버튼
     * =======================================
     */
    $("#delBtn").on("click", function() {
        let parameter = $("#delForm").serializeObject();
        
        // 객체가 빈값이면 true
        if($.isEmptyObject(parameter)) return false;

        $.ajax({
            type : "post",
            url : "/admin/images/del",
            dataType : "JSON",
            data : parameter
        })
        .done(function(result){
            console.log(result);
            let listHtml = "";
            $(".images__list--item").empty();

            if(Array.isArray(result) && result.length === 0) { 
                listHtml += "<strong>값이 없습니다.</strong>"
                $(".images__list").append(listHtml);
            } else {
            //    for(let i = 0; i < result.length; i++){

            //    }
            }

        })
        .fail(function(xhr, status, errorThrown){
            console.log("이미지 업로드 파일 삭제 Ajax failed");
        })
    })
});
