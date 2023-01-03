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
            $(".images__list").empty();

            if(Array.isArray(result) && result.length === 0) { 
                let listHtml = "";
                listHtml += "<strong>데이터가 없습니다.</strong>"
                $(".images__list").append(listHtml);
            } else {
                let listHtml = "";
                for(let i = 0; i < result.length; i++){
                    listHtml += "<li class='images__list--item'>";
                    listHtml += "<label>";
                    listHtml += "<input type='checkbox' name='image' value='" + result[i] + "'>";
                    listHtml += "<img src='/uploads/" + result[i] + ">";
                    listHtml += "</label>";
                    listHtml += "<span>" + result[i] + "</span>";
                    listHtml += "</li>";
                }
                $(".images__list").append(listHtml);
            }
        })
        .fail(function(xhr, status, errorThrown){
            console.log("이미지 업로드 파일 삭제 Ajax failed");
        })
    })
});
