/**
 * =======================================
 * 설  명 : 전체 선택/해제
 * =======================================
 */
function fnAllChkHandler() {
    let imageChk = $("input:checkbox[name='image']");
    let imageAllChk = $("input:checkbox[name='allChk']");

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
}


$(function() {
    fnAllChkHandler() // all check

    /**
     * =======================================
     * 설  명 : 이미지 uload 삭제 버튼
     * =======================================
     */
    $("#delBtn").on("click", function() {
        let parameter = $("#delForm").serializeObject();
        let listHtml = "";
        let chkCount = $("input[name='image']:checked").length;

        // 객체가 빈값이면 true
        if($.isEmptyObject(parameter)) {
            alert("선택된 건이 없습니다.");
            return false;
        }

        let chkCountFlag = window.confirm(chkCount + "건이 삭제됩니다. 삭제하면 되돌릴 수 없습니다.");

        if(chkCountFlag) {
            $.ajax({
                type : "post",
                url : "/admin/images/del",
                dataType : "JSON",
                data : parameter
            })
            .done(function(result){
                $(".images__list").empty();
    
                if(Array.isArray(result) && result.length === 0) {
                    $(".images__mng").hide();
                    listHtml += "<strong>데이터가 없습니다.</strong>"
                    $(".images__list").append(listHtml);
                    fnAllChkHandler(); 
                } else {
                    for(let i = 0; i < result.length; i++){
                        listHtml += "<li class='images__list--item'>";
                        listHtml += "<label>";
                        listHtml += `<input type='checkbox' name='image' value='${result[i]}'>`;
                        listHtml += `<img src='/uploads/${result[i]}'>`;
                        listHtml += "</label>";
                        listHtml += `<span>${result[i]}</span>`;
                        listHtml += "</li>";
                    }
                    $(".images__list").append(listHtml);
                    fnAllChkHandler(); 
                }
            })
            .fail(function(xhr, status, errorThrown){
                console.log("이미지 업로드 파일 삭제 Ajax failed");
            })
        }
    })
});
