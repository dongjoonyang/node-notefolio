/* 媛쒖젙�대젰 寃뚯떆�� �곸닔 */
const NOTICE_PLANNING = "NTS001",
    NOTICE_COMPLETION = "NTS002";

$(function ($) {
    let roleCode = JSON.parse(sessionStorage.getItem("session")).SPRING_SECURITY_CONTEXT.authentication.principal.roleCode;

    let noticeId = $.getUrlParam("id"),
        categoryId = $.getUrlParam("categoryId"),
        reference = $.getUrlParam("reference"),
        selectedCategoryId = (categoryId === null ? null : categoryId),
        categoryMaxCount = 5,
        selectedRow = null,
        categoryName = null;

    let filePolicy = {
        accept: "image/*",
        size: 2097152 //byte
    };

    InitializingCategory(); //category 由ъ뒪�몃� �ｋ뒗��.

    /*
     * =======================================
     * ��  紐� : �쒖꽦�� �� 移댄뀒怨좊━�� 寃뚯떆湲� 由ъ뒪�몃� 遺덈윭�⑤떎.
     * �묒꽦��/�묒꽦�� : 怨좏쁽��/2022.03.17
     * =======================================
     */
    let noticeGrid = $("#noticeGrid").DataTable({
            paging: true,
            pageLength: 20,
            autoWidth: true,
            scrollY: "710px",
            ordering: false,
            select: {style: "single", toggleable: true},
            columns: [
                {data: "id", name: "id", orderable: false, searchable: false, render: function(data, type, row) {
                        if (Number(data) === Number(noticeId)) {
                            selectedRow = row.scrollIndex
                        }
                        return row.rowNum;
                    }},
                {data: "statusCode", name: "statusCode", orderable: false, searchable: false, render: function(data) {
                        let textHighlight = null;
                        if (data === NOTICE_PLANNING) textHighlight = "color-red";
                        if (data === NOTICE_COMPLETION) textHighlight = "color-blue";

                        return '<strong class="' + textHighlight + '">' + fnGetNoticeStatusCode(data) + '</strong>';
                    }},
                {data: "title", name: "title", orderable: false, searchable: false, render: function(data, type, row) {
                        let info = "";
                        if (row.useYn === "N"){
                            info += '<p class="user-notice-private"></p>';
                        }
                        info += "<p class='user-notice-tit'>";
                        info += fnNullChk(data);
                        info += "</p>";

                        if (!readNoticeList.hasOwnProperty(row.id)
                            && (new Date().getTime() - new Date(row.lastUpdatedAt.replace(/[.-]/gi, "/")).getTime()) < 1000 * 60 * 60 * 24 * noticeNewFlagDays) {
                            info += '<p id="newFlag-' + row.id + '" class="user-notice-new"></p>';
                        }

                        return info;
                    }},
                {data: "createdBy", name: "createdBy", orderable: false, searchable: false, render: function(data) {
                        return fnNullChk(data);
                    }},
                {data: "createdAt", name: "createdAt", orderable: false, searchable: false, render: function(data) {
                        return fnNullChk(data);
                    }},
                {data: "lastUpdatedBy", name: "lastUpdatedBy", visible: false},
                {data: "lastUpdatedAt", name: "lastUpdatedAt", visible: false},
                {data: "categoryId", name: "categoryId", visible: false},
                {data: "categoryName", name: "categoryName", visible: false},
            ],
            ajax: function (gridData, callback, settings) {
                if (selectedCategoryId === null) return;

                let row = [],
                    draw = gridData.draw,
                    start = gridData.start,
                    length = gridData.length,
                    page = fnGridGetPage(start, length),
                    schVal = gridData.search.value,
                    parameter = "page=" + page + "&size=" + length + "&categoryId=" + selectedCategoryId,
                    encodeSchVal = fnEncode($("#schInput").val());

                if (reference === "REFERENCE"){
                    $("#schContentsSel").val("title");
                    $("#schContentsSel").selectmenu("refresh");
                    parameter += "&reference=" + encodeSchVal;
                    reference = null;

                }else{
                    switch ($("#schContentsSel").val()) {
                        case "title":
                            parameter += "&title=" + encodeSchVal;
                            break;

                        case "contents":
                            parameter += "&contents=" + encodeSchVal;
                            break;

                        case "titleOrContents":
                            parameter += "&titleOrContents=" + encodeSchVal;
                            break;

                        case "id":
                            parameter += "&id=" + encodeSchVal;
                            break;

                    }
                    if ($("#schStatusSel").val() !== "") parameter += "&statusCode=" + $("#schStatusSel").val();
                }

                $.ajax({
                    type: "GET",
                    url: "/notice/data",
                    data: parameter,
                    success: function (result) {
                        if (result.success === true) {
                            let total = result.data.total;
                            _.forEach(result.data.list, function (val, key) {
                                val.scrollIndex = key;
                                val.rowNum = (total - key) - (length * (page - 1));
                            });

                            $("#boardTotal").html(total);

                            fnGridReadAjaxSuccess(result, draw, callback);
                            if (selectedRow === null) {
                                noticeGrid.row(":eq(0)", {page: "current"}).select();

                            } else {
                                noticeGrid.row(":eq(" + selectedRow + ")", {page: "current"}).select();
                                selectedRow = null;

                            }
                        }
                    }
                });
            }
        });
    noticeGrid.on("select", function () {
        fnGridSelToggle(noticeGrid);
    });

    $("#schBtn").click(function (e) {
        history.replaceState(null, null, location.origin + location.pathname);
        noticeGrid.draw();
        e.preventDefault();
    });

    /*
     * =======================================
     * ��  紐� : 怨듭��ы빆 �깅줉 �앹뾽 �ㅽ뵂
     * �묒꽦��/�묒꽦�� : �묐룞以�/2022.03.12
     *
     * �섏젙��/�섏젙�� : 怨좏쁽��/2022.03.14
     * �섏젙�댁뿭 : �먮뵒�� 珥덇린��
     * =======================================
     */
    $("#addBtn").click(function (e) {
        let formData = new FormData();
        formData.append("noticeIdPath", "temp");
        formData.append("categoryIdPath", selectedCategoryId);

        $.ajax({
            type: "POST",
            url: "/notice/file/cancel",
            enctype: 'multipart/form-data',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success:function (e) {

            }
        });

        $("#noticeEditAlert").html(fnLangGet().notice.noticeAdd);
        $("#noticeEditNoticeId").val("");
        $("#noticeEditTitleInput").val("");
        $("#noticeEditStatusSel").val(NOTICE_PLANNING);
        $("#noticeEditStatusSel").selectmenu("refresh");
        $("#noticeEditCategoryId").val("");
        $("#noticeEditRefInput").val("");
        showEditor("#noticeEditor");
        setEditorContents("#noticeEditor", null);
        fnLayerOpen({layerSelector: ".notice-edit-pop", state: "open"});
    });

    /*
     * =======================================
     * ��  紐� : �꾩옱 蹂닿퀬 �덈뒗 寃뚯떆�먯쓽 �뺣낫瑜� �섏젙
     * �묒꽦��/�묒꽦�� : 怨좏쁽��/2022.03.14
     * =======================================
     */
    $("#modBtn").click(function (e) {
        if (!fnGridRowSelChk(noticeGrid, "mod", fnLangGet().alert.modSelect)) return;

        showEditor("#noticeEditor");
        fnLayerOpen({layerSelector: ".notice-edit-pop", state: "open"});

        setEditorContents("#noticeEditor", $("#detailViewContents").html());
        $("#noticeEditAlert").html(fnLangGet().notice.noticeMod);
        $("#noticeEditNoticeId").val($("#detailViewContents").data("noticeId"));
        $("#noticeEditTitleInput").val($("#detailViewContents").data("title"));
        $("#noticeEditStatusSel").val($("#detailViewContents").data("statusCode"));
        $("#noticeEditStatusSel").selectmenu("refresh");
        $("#noticeEditCategoryId").val($("#detailViewContents").data("categoryId"));
        $("#noticeEditRefInput").val($("#detailViewContents").data("reference"));

        let useYn = $("#detailViewContents").data("useYn");
        if (useYn === "Y") $("#noticeEditUseYRadio").prop("checked", "checked");
        if (useYn === "N") $("#noticeEditUseNRadio").prop("checked", "checked");

    });

    /*
     * =======================================
     * ��  紐� : 寃뚯떆�먯쓽 statusCode statusName 諛섑솚
     * �묒꽦��/�묒꽦�� : 怨좏쁽��/2022.03.14
     * =======================================
     */
    function fnGetNoticeStatusCode(code) {
        switch (code) {
            case NOTICE_PLANNING:
                return "�덉젙";

            case NOTICE_COMPLETION:
                return "�꾨즺";

            default:
                return "-";
        }
    }

    /*
     * =======================================
     * ��  紐� : 寃뚯떆�먮ぉ濡� �대┃ �� �대떦 寃뚯떆�먯쓽 �곸꽭 �댁슜�� ���� GET �붿껌
     * �묒꽦��/�묒꽦�� : 怨좏쁽��/2022.03.14
     * =======================================
     */
    function fnGridSelToggle(selGrid) {
        let selectedRow = selGrid.rows({selected: true}),
            count = selectedRow.count();

        if (count === 1) {
            let data = selectedRow.data()[0];

            $.ajax({
                type: "GET",
                url: "/notice/data/" + data.id,
                success: function (result) {
                    if (result.success === true) {
                        let aData = result.data;
                        $("#noticeDetail").html(fnGetDetailView(aData));

                        readNoticeList[data.id] = {"id": data.id, "lastUpdatedAt": data.lastUpdatedAt};
                        localStorage.setItem("readNoticeList", JSON.stringify(readNoticeList));
                        callLatestNotice();
                        $("#newFlag-"+ data.id).remove();

                        let convertUrl = location.origin + location.pathname + "?id=" + data.id + "&categoryId=" + data.categoryId;
                        history.replaceState(null, null, convertUrl);
                    }
                }
            });

        }
    }

    /*
     * =======================================
     * ��  紐� : 寃뚯떆�� �곸꽭蹂닿린
     * �묒꽦��/�묒꽦�� : 怨좏쁽��/2022.03.14
     * =======================================
     */
    function fnGetDetailView(data) {
        if (data === null || data === undefined) {
            return fnClearViewDetail();
        }

        let info = '<div class="detail-header">';
        info += '<h2>' + data.title + '</h2>';
        info += '<p class="detail-sub-tit">' + data.categoryName + '</p>';
        info += '<dl class="detail-col">';
        info += '<dt class="detail-col-tit">' + fnLangGet().notice.status + '</dt>';
        info += '<dd class="detail-col-text">' + fnGetNoticeStatusCode(data.statusCode) + '</dd>';
        info += '<dt class="detail-col-tit">' + fnLangGet().notice.writer + '</dt>';
        info += '<dd class="detail-col-text">' + data.createdBy + '</dd>';
        info += '<dt class="detail-col-tit">' + fnLangGet().notice.dateCreated + '</dt>';
        info += '<dd class="detail-col-text">' + data.createdAt + '</dd>';
        info += '<dt class="detail-col-tit">' + fnLangGet().notice.dateModification + '</dt>';
        info += '<dd class="detail-col-text">' + fnNullChk(data.updatedAt) + '</dd>';
        info += '</div>';
        info += '<div id="detailViewContents" class="detail-body"';
        info += ' data-notice-id="' + data.id + '" data-category-id="' + data.categoryId + '"';
        info += ' data-title="' + data.title + '" data-status-code="' + data.statusCode + '"';
        info += ' data-reference="' + data.reference + '" data-use-yn="' + data.useYn + '"';
        info += '>';
        info += data.contents;
        info += '</div>';

        return info;
    }

    function fnClearViewDetail() {
        // 而⑦뀗痢� �댁슜 �놁쓣��
        let emptyBody = '<div class="detail-body-empty"><span>' + fnLangGet().notice.emptyData + '></span></div>';
        $("#noticeDetail").html(emptyBody);
        return emptyBody;
    }

    /*
     * =======================================
     * ��  紐� : 寃뚯떆�먮ぉ濡� 湲� �대┃ �� 寃뚯떆�� ��젣
     * �묒꽦��/�묒꽦�� : 怨좏쁽��/2022.03.14
     * =======================================
     */
    $("#delBtn").click(function (e) {
        let selectedRow = noticeGrid.rows({selected: true}),
            count = selectedRow.count(),
            data = selectedRow.data()[0];

        if (count === 1) {
            fnGridAjaxDel(noticeGrid, "item", "/notice/" + data.id + "?categoryId=" + data.categoryId, function (){
                fnClearViewDetail();

            });
            fnLayerOpen({layerSelector: ".del-pop", state: "open"});
        }


    });

    /*
     * =======================================
     * ��  紐� : 寃뚯떆�� 湲��곌린 �앹뾽李쎌쓽 summernote �먮뵒�� �쒖꽦��
     * �묒꽦��/�묒꽦�� : 怨좏쁽��/2022.03.14
     * =======================================
     */
    function showEditor(selectHtmlQuery) {
        setTimeout(function(){
            $("#noticeEditForm .note-editable").focus();
        }, 10);
        $(selectHtmlQuery).summernote({
            tabsize: 2,
            height: '40vh',
      	  	lang: "ko-KR",
            disableResizeEditor: false,
            tabDisable: true, 
            styleTags: [
	            'p',{ title: 'Blockquote', tag: 'blockquote', className: 'blockquote', value: 'blockquote' },
	            'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
	        ],
	        lineHeights: ['0.2', '0.3', '0.4', '0.5', '0.6', '0.8', '1.0', '1.2', '1.4', '1.5', '2.0', '3.0'],
	        fontNames: ['Roboto', 'Nanum Gothic', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Merriweather'],
	        fontNamesIgnoreCheck: ['Merriweather'],
            toolbar: [
                ['style', ['style']], // styleTags �ㅽ��� �쒓렇
                ['font', ['bold', 'underline', 'clear']],
                ['fontname', ['fontname']],
                ['fontsize', ['fontsize']],
                ['height', ['height']], // lineHeights �됯컙
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['table', ['table']],
                ['insert', ['link', 'picture']]
            ],
            callbacks: {
                onImageUpload: function (files) {
                    setTimeout(function(){
                        $("#noticeEditForm .note-editable").focus();
                    }, 10);
                    let file = files[0];
                    if (file.size >= filePolicy.size){
                        fnMsgLayerOpen(fnLangGet().alert.title, "�ъ씠利� 2mb �댄븯�� �ъ쭊留� �낅줈�쒓� 媛��ν빀�덈떎.");
                        return;
                    }
                    if (!file.type.match(filePolicy.accept)){
                        fnMsgLayerOpen(fnLangGet().alert.title, "�щ컮瑜댁� �딆� �뚯씪 �뺤떇�낅땲��.");
                        return;
                    }

                    let formData = new FormData();
                    if ($("#noticeEditNoticeId").val() !== null && $("#noticeEditNoticeId").val().trim() !== ""){
                        formData.append("noticeIdPath", $("#noticeEditNoticeId").val());
                    }
                    formData.append("categoryIdPath", selectedCategoryId);
                    formData.append("file", file);

                    $.ajax({
                        type: "POST",
                        url: "/notice/file",
                        enctype: 'multipart/form-data',
                        data: formData,
                        async: false,
                        cache: false,
                        contentType: false,
                        processData: false,
                        success: function (result) {
                            if (result.success === true) {
                                let imgNode = document.createElement("img");
                                imgNode.src = result.data
                                imgNode.style.maxWidth = "100%"
                                $(selectHtmlQuery).summernote('insertNode', imgNode);

                            } else if (result.success === false){
                                fnMsgLayerOpen(fnLangGet().alert.title, "�щ컮瑜댁� �딆� �뚯씪 �뺤떇�낅땲��.");

                            }
                        }
                    });
                }
            }
        });
    }

    /*
     * =======================================
     * ��  紐� : summernote �먮뵒�곗뿉 �묒꽦�� HTML�� 媛믪쓣 �삳뒗��.
     * �묒꽦��/�묒꽦�� : 怨좏쁽��/2022.03.14
     * =======================================
     */
    function getEditorContents(selectHtmlQuery) {
        return $(selectHtmlQuery).summernote("code");
    }

    /*
     * =======================================
     * ��  紐� : summernote �먮뵒�곗븞�� HTML�� htmlContents濡� 蹂�寃쏀븳��.
     * �묒꽦��/�묒꽦�� : 怨좏쁽��/2022.03.14
     * =======================================
     */
    function setEditorContents(selectHtmlQuery, htmlContents) {
        $(selectHtmlQuery).summernote("code", htmlContents);
    }

    /*
     * =======================================
     * ��  紐� : �덈뱺�명뭼�� 移댄뀒怨좊━�꾩씠�� �좊Т濡� UPDATE<>CREATE 遺꾧린�먯쓣 �섎늿��.
     *         validation 泥댄겕 �� �묒꽦�� 湲��� �뚮씪誘명꽣媛믪뿉 留욊쾶 ���ν븳��.
     * �묒꽦��/�묒꽦�� : 怨좏쁽��/2022.03.14
     * =======================================
     */
    $("#editNoticeBtn").click(function (e) {
        var noticeEditForm = $("#noticeEditForm").validate({
            rules: {
                title: {
                    minlength: 1,
                    maxlength: 100,
                }
            },
            submitHandler: function(form) {
                $("#noticeEditCategoryId").val(selectedCategoryId);
                $("#noticeEditContents").val(getEditorContents("#noticeEditor"));

                let formValObj = fnGetInputTxtTrimForm($("#noticeEditForm")).serializeObject(),
                    parameter = JSON.stringify(formValObj);

                let updateFlag = $("#noticeEditNoticeId").val().trim();
                if (updateFlag === "" || updateFlag === undefined || updateFlag === null) {
                    $.ajax({
                        type: "POST",
                        async: false,
                        url: "/notice",
                        data: parameter,
                        success: function (result) {
                            if (result.success === true) {
                                location.href = location.origin + location.pathname +
                                    "?categoryId=" + selectedCategoryId;

                            } else if (result.success === false) {
                                fnAjaxFailMsgMng(result);
                            }
                        }
                    });

                } else {
                    $.ajax({
                        type: "PUT",
                        url: "/notice/" + updateFlag,
                        async: false,
                        data: parameter,
                        success: function (result) {
                            if (result.success === true) {
                                location.href = location.origin + location.pathname +
                                    "?id=" + updateFlag + "&categoryId=" + selectedCategoryId;

                            } else if (result.success === false) {
                                fnAjaxFailMsgMng(result);

                            }
                        }
                    });
                }
            }
        });
    });

    /*
	 * =======================================
	 * ��  紐� : �섏씠吏��� 移댄뀒怨좊━ 由ъ뒪�� 遺덈윭�ㅺ린
	 * �묒꽦��/�묒꽦�� : 怨좏쁽��/2022.03.17
	 * =======================================
	 */
    function InitializingCategory() {
        $.ajax({
            type: "GET",
            async: false,
            url: "/notice/category/data",
            success: function (result) {
                $("#categoryList").html("");
                _.forEach(result.data.list, function (val, key) {
                    if (reference !== null && reference !== "" && reference !== undefined){
                        if (val.categoryName.toUpperCase().indexOf('FIRMWARE') !== -1){
                            selectedCategoryId = val.categoryId;
                            $("#schInput").val(reference);
                            categoryName = val.categoryName.toUpperCase();
                            reference = "REFERENCE";
                        }

                    }else if (selectedCategoryId === null){
                        selectedCategoryId = val.categoryId;

                    }

                    $("#categoryList").append(fnGetCategoryCard(val));
                });

                $(".nts-lst").click(function (e) {
                    fnClearViewDetail();

                    $(".nts-lst").removeClass("on");
                    $(this).addClass("on");

                    // if (roleCode.match(/[\s\S]+(_ADMIN)$/)){
                    if (roleCode === ROLE_SYSTEM_ADMIN){
                        $("#noticeEditorBox").removeClass("display-none");

                    }else{
                        $("#noticeEditorBox").addClass("display-none");

                    }

                    if ($(this).hasClass("chr-btn")){
                        if (roleCode === "ROLE_SYSTEM_ADMIN") {
                            $("#noticeEditorBox").removeClass("display-none");

                        }else{
                            $("#noticeEditorBox").addClass("display-none");

                        }
                    }
                    categoryName = $(this).html().toUpperCase();

                    fnRefreshNoticeSch();
                    selectedCategoryId = this.dataset.categoryId;
                    noticeGrid.draw();

                    let convertUrl = location.origin + location.pathname + "?categoryId=" + this.dataset.categoryId;
                    history.replaceState(null, null, convertUrl);
                });

                if (roleCode === "ROLE_SYSTEM_ADMIN") {
                    $("#noticeEditorBox").removeClass("display-none");

                } else if (roleCode.match(/[\s\S]+(_ADMIN)$/) && $(".nts-lst.on").data("publicUseYn") === 'N'){
                    $("#noticeEditorBox").removeClass("display-none");

                }else{
                    $("#noticeEditorBox").addClass("display-none");

                }
            }
        });
    }

    /*
	 * =======================================
	 * ��  紐� : 寃��됱갹 珥덇린��
	 * �묒꽦��/�묒꽦�� : 怨좏쁽��/2022.03.17
	 * =======================================
	 */
    function fnRefreshNoticeSch(){
        $("#schContentsSel").val("title");
        $("#schContentsSel").selectmenu("refresh");
        $("#schStatusSel").val("");
        $("#schStatusSel").selectmenu("refresh");
        $("#schInput").val("");
    }

    /*
     * =======================================
     * ��  紐� : data媛믪뿉 留욊쾶 移댄뀒怨좊━瑜� 留뚮뱾�� �대떦 node瑜� 諛섑솚�쒕떎.
     *          (�꾩옱 怨좉컼�� 湲��곌린 鍮꾪솢�깊솕)
     * �묒꽦��/�묒꽦�� : 怨좏쁽��/2022.03.17
     * =======================================
     */
    function fnGetCategoryCard(data) {
        let categoryCard = document.createElement("li");
        categoryCard.className = "board-item";
        let btnClassName = "nts-lst ";

        if (roleCode === ROLE_SYSTEM_ADMIN){
            switch (data.useYn) {
                case "Y":
                    if (data.publicUseYn === 'Y') btnClassName += "chr-btn ";
                    if (data.publicUseYn === 'N') btnClassName += "achr-btn ";
                    break;

                case "N":
                    btnClassName += "private-btn ";
                    break;
            }

        }else{
            if (data.publicUseYn === 'Y') btnClassName += "chr-btn ";
            if (data.publicUseYn === 'N') btnClassName += "display-none ";
            if (data.useYn === 'N') btnClassName += "display-none ";

        }

        if (Number(data.categoryId) === Number(selectedCategoryId)) btnClassName += "on";

        let showMVMT = "";

        if (roleCode === ROLE_SYSTEM_ADMIN){
            if (data.mvmtUseYn === 'Y')
            showMVMT = '<span class="board-item-branch company-all">M</span>';

            if (data.mvmtUseYn === 'N')
            showMVMT = '<span class="board-item-branch company-link">N</span>';

            if (data.mvmtUseYn === null)
            showMVMT = '<span class="board-item-branch company-general">C</span>';

        }

        categoryCard.innerHTML = '<button type="button" class="' + btnClassName +'" ' +
            'data-category-id="' + data.categoryId + '" ' + 'data-public-use-yn="' + data.publicUseYn + '" ' +
            'data-mvmt-use-yn="' + data.mvmtUseYn + '" ' +
            'title="' + data.description + '">' + showMVMT + data.categoryName + '</button>';

        return categoryCard;
    }

    /*
     * =======================================
     * ��  紐� : 移댄뀒怨좊━ �좏깮
     * �묒꽦��/�묒꽦�� : �묐룞以�/2022.03.12
     * =======================================
     */
    $(".board-item button").click(function (e) {
        let categoryBtn = $(this).hasClass("on");

        if (!categoryBtn) {
            $(".board-item button").removeClass("on");
            $(this).addClass("on");
        }
    });

    /*
	 * =======================================
	 * ��  紐� : 移댄뀒怨좊━ �ㅼ젙  �앹뾽 �ㅽ뵂
	 * �묒꽦��/�묒꽦�� : �묐룞以�/2022.03.12
	 * =======================================
	 */
    if (roleCode !== ROLE_SYSTEM_ADMIN) $("#categoryEditBtn").addClass("display-none");
    // if (!roleCode.match(/[\s\S]+(_ADMIN)$/)) $("#categoryEditBtn").addClass("display-none");
    $("#categoryEditBtn").click(function (e) {
        // if (!roleCode.match(/[\s\S]+(_ADMIN)$/)) {
        if (roleCode !== ROLE_SYSTEM_ADMIN) {
            e.preventDefault()
            return;
        }

        clearEditorBox();

        $(".category-box")[0].scrollTop = 0;

        $.ajax({
            type: "GET",
            url: "/notice/category/data",
            success: function (result) {
                $(".category-list").html("");
                _.forEach(result.data.list, function (val, key) {
                    let info = "";
                    let showMVMT = "";

                    if (val.mvmtUseYn === null)
                        showMVMT = '<span class="board-item-branch company-all">C</span>';

                    if (val.mvmtUseYn === "Y")
                        showMVMT = '<span class="board-item-branch company-link">M</span>'

                    if (val.mvmtUseYn === "N")
                        showMVMT = '<span class="board-item-branch company-general">N</span>'

                    if (val.publicUseYn === "Y") {
                        info += '<li class="category-item">';
                        info += '<span data-category-id="' + val.categoryId + '" ';
                        info += 'data-category-name="' + val.categoryName + '" ';
                        info += 'data-description="' + val.description + '" ';
                        info += 'data-public-use-yn="' + val.publicUseYn + '" ';
                        info += 'data-use-yn="' + val.useYn + '"';
                        info += 'data-mvmt-use-yn="' + val.mvmtUseYn + '" ';
                        info += '>';
                        info += showMVMT + val.categoryName;
                        info += '</span>';

                        if (roleCode === "ROLE_SYSTEM_ADMIN") {
                            info += '<a href="javascript:;"';
                            info += 'data-category-id="' + val.categoryId + '" ';
                            info += 'data-public-use-yn="' + val.publicUseYn + '" ';
                            info += 'class="category-item-del"></a>';
                        }
                        info += '</li>';

                        $("#publicUseCategory")[0].innerHTML += info;
                    }

                    if (val.publicUseYn === "N") {
                        info += '<li class="category-item">';
                        info += '<span data-category-id="' + val.categoryId + '" ';
                        info += 'data-category-name="' + val.categoryName + '" ';
                        info += 'data-description="' + val.description + '" ';
                        info += 'data-public-use-yn="' + val.publicUseYn + '" ';
                        info += 'data-use-yn="' + val.useYn + '"';
                        info += 'data-mvmt-use-yn="' + val.mvmtUseYn + '" ';
                        info += '>';
                        info += showMVMT + val.categoryName;
                        info += '</span>';
                        info += '<a href="javascript:;"';
                        info += 'data-category-id="' + val.categoryId + '" ';
                        info += 'data-public-use-yn="' + val.publicUseYn + '" ';
                        info += 'class="category-item-del"></a>';
                        info += '</li>';

                        $("#privateUseCategory")[0].innerHTML += info;
                    }
                });

                $(".category-item").unbind("click");
                $(".category-item").click(function (e) {
                    let category = $(this).children("span:eq(0)");
                    if (category.data("publicUseYn") === "Y" && roleCode !== "ROLE_SYSTEM_ADMIN") return;

                    $(".category-item").removeClass("on");
                    $(this).addClass("on");

                    newEditorBox();

                    $("#categoryEditIdInput").val(category.data("categoryId"));
                    $("#categoryEditNameInput").val(category.data("categoryName"));
                    $("#categoryEditDescriptionInput").val(category.data("description"));
                    switch (category.data("useYn")) {
                        case "Y":
                            $("#categoryEditUseYRadio").prop("checked", "checked");
                            $("#categoryEditUseNRadio").prop("checked", "");
                            break;

                        case "N":
                            $("#categoryEditUseYRadio").prop("checked", "");
                            $("#categoryEditUseNRadio").prop("checked", "checked");
                            break;

                    }

                    switch (category.data("publicUseYn")) {
                        case "Y":
                            $("#categoryEditPublicYRadio").prop("checked", "checked");
                            $("#categoryEditPublicNRadio").prop("checked", "");
                            break;

                        case "N":
                            $("#categoryEditPublicYRadio").prop("checked", "");
                            $("#categoryEditPublicNRadio").prop("checked", "checked");
                            break;

                    }

                    switch (category.data("mvmtUseYn")) {
                        case "Y":
                            $("#categoryEditMovementUseYChk").prop("checked", "checked");
                            $("#categoryEditMovementUseNChk").prop("checked", "");
                            break;

                        case "N":
                            $("#categoryEditMovementUseYChk").prop("checked", "");
                            $("#categoryEditMovementUseNChk").prop("checked", "checked");
                            break;

                        default:
                            $("#categoryEditMovementUseYChk").prop("checked", "checked");
                            $("#categoryEditMovementUseNChk").prop("checked", "checked");

                    }

                    $(".category-edit-input").prop("readonly", false);
                });

                $(".category-item > .category-item-del").unbind("click");
                $(".category-item > .category-item-del").click(function (e) {
                    let categoryId = $(this).data("categoryId");
                    let publicUseYn = $(this).data("publicUseYn");

                    $("#delPopSaveBtn").unbind("click");
                    $("#delPopSaveBtn").click(function (e) {
                        $.ajax({
                            type: "DELETE",
                            url: "/notice/category/" + categoryId + "?&categoryPublicUseYn=" + publicUseYn + "&categoryId=" + categoryId,
                            success: function (result) {
                                if (result.success === true) {
                                    $("#delPopSaveBtn").closest(".layer-n").fadeOut();
                                    fnMsgLayerOpen(fnLangGet().alert.title, fnLangGet().alert.delSuccess);
                                    InitializingCategory();
                                    newEditorBox();
                                    $("#categoryEditBtn").click();
                                    $(".category-edit-input").prop("readonly", true);

                                } else if (result.success === false) {
                                    fnMsgLayerOpen(fnLangGet().alert.title, "寃뚯떆湲��� 議댁옱�섎뒗 移댄뀒怨좊━�� ��젣�� �� �놁뒿�덈떎.");

                                }
                            }
                        });
                    });
                    fnLayerOpen({layerSelector: ".del-pop", state: "open"});

                });

                $("#categoryNewBtn").unbind("click");
                $("#categoryNewBtn").click(function (e) {
                    if ($("#ongoingNewCategory")[0] === undefined) {
                        $(".category-item").removeClass("on");
                        $(".category-item").unbind("click");

                        $(".category-edit-input").prop("readonly", false);

                        $("#privateUseCategory")[0].innerHTML
                            += '<li id="ongoingNewCategory" class="category-new-btn category-item on">New Category</li>';

                        $(".category-box")[0].scrollTop = $(".category-box")[0].scrollHeight;
                        newEditorBox();
                    }
                });

                $("#categoryEditSaveBtn").unbind("click");
                $("#categoryEditSaveBtn").click(function (e) {
                    var categoryEditForm = $("#categoryEditForm").validate({
                        rules: {
                            categoryName: {
                                minlength: 1,
                                maxlength: 30,
                            },
                            description: {
                                maxlength: 30
                            }
                        },
                        submitHandler: function(form) {
                            if($("#categoryEditNameInput").prop("readonly")) {
                                e.preventDefault();
                                return;
                            }

                            if ($(".category-edit-movement-use-checkbox:checked").size() > 1) {
                                $(".category-edit-movement-use-checkbox").prop("checked", null);

                            }

                            let formValObj = fnGetInputTxtTrimForm($("#categoryEditForm")).serializeObject(),
                                parameter = JSON.stringify(formValObj);

                            let categoryId = $("#categoryEditIdInput").val();

                            if (categoryId === "" || categoryId === undefined || categoryId === null) {
                                if ($("#privateUseCategory > li").size() > categoryMaxCount){
                                    fnMsgLayerOpen(fnLangGet().alert.title, "怨좉컼�� 移댄뀒怨좊━�� " + categoryMaxCount + "媛쒕� 珥덇낵�� �� �놁뒿�덈떎.");
                                    return;
                                }

                                $.ajax({
                                    type: "POST",
                                    url: "/notice/category",
                                    data: parameter,
                                    success: function (result) {
                                        if (result.success === true) {
                                            fnMsgLayerOpen(fnLangGet().alert.title, fnLangGet().alert.saveSucees);
                                            newEditorBox();
                                            InitializingCategory();
                                            $("#categoryEditBtn").click();
                                            $(".category-edit-input").prop("readonly", true);

                                        } else if (result.success === false) {
                                            fnAjaxFailMsgMng(result);

                                        }
                                    },
                                });

                            } else {
                                $.ajax({
                                    type: "PUT",
                                    url: "/notice/category/" + categoryId,
                                    data: parameter,
                                    success: function (result) {
                                        if (result.success === true) {
                                            fnMsgLayerOpen(fnLangGet().alert.title, fnLangGet().alert.saveSucees);
                                            InitializingCategory();
                                            newEditorBox()
                                            $("#categoryEditBtn").click();
                                            $(".category-edit-input").prop("readonly", true);

                                        } else if (result.success === false) {
                                            fnAjaxFailMsgMng(result);

                                        }
                                    }
                                });
                            }
                        }
                    });
                });
            }
        });

        function clearEditorBox() {
            $("#categoryEditIdInput").val(null);
            $("#categoryEditNameInput").val(null);
            $("#categoryEditNameInput").prop("readonly", true)
            $("#categoryEditDescriptionInput").val(null);
            $("#categoryEditDescriptionInput").prop("readonly", true)
            $("#categoryEditUseYRadio").prop("checked", "checked");
            $("#categoryEditUseNRadio").prop("checked", null);
            $(".category-edit-movement-use-checkbox").prop("checked", "checked");

            if (roleCode === "ROLE_SYSTEM_ADMIN") {
                $("#categoryEditPublicYRadio").prop("checked", "checked");
                $("#categoryEditPublicNRadio").prop("checked", null);

            } else {
                $("#categoryEditPublicYRadio").prop("checked", null);
                $("#categoryEditPublicNRadio").prop("checked", "checked");

            }

        }

        function newEditorBox() {
            $("#categoryEditIdInput").val(null);
            $("#categoryEditNameInput").val(null);
            $("#categoryEditDescriptionInput").val(null);
            $("#categoryEditUseYRadio").prop("checked", "checked");
            $("#categoryEditUseNRadio").prop("checked", null);
            $(".category-edit-movement-use-checkbox").prop("checked", "checked");

            if (roleCode === "ROLE_SYSTEM_ADMIN") {
                $("#categoryEditPublicYRadio").prop("checked", "checked");
                $("#categoryEditPublicNRadio").prop("checked", null);

            } else {
                $("#categoryEditPublicYRadio").prop("checked", null);
                $("#categoryEditPublicNRadio").prop("checked", "checked");

            }

        }
        fnLayerOpen({layerSelector: ".category-edit-pop", state: "open"});


        $("#categoryEditPublicYRadio").click(function (e) {
            $(".category-edit-movement-use-checkbox").prop("readonly", null);
            $(".category-edit-movement-use").removeClass("display-none");

        });

        $("#categoryEditPublicNRadio").click(function (e) {
            $(".category-edit-movement-use-checkbox").prop("checked", "checked");
            $(".category-edit-movement-use").addClass("display-none");

        });

        $(".category-edit-movement-use-checkbox").click(function (e) {
            let checkedTags = $(".category-edit-movement-use-checkbox:checked");
            if (checkedTags.size() < 1){
                fnMsgLayerOpen(fnMsgLayerOpen(fnLangGet().alert.title, fnLangGet().notice.oneSelect));
                e.preventDefault();
                return;
            }

            switch (checkedTags) {
                case 2:
                    '<span style="font-size: 0.6rem; color: #1ba74f; padding: 3px;">C</span>';
                    break;

                case 1:
                    if (checkedTags.val() === "Y"){
                        '<span style="font-size: 0.6rem; color: #2b9aff; padding: 3px;">M</span>'
                    }

                    if (checkedTags.val() === "N"){
                        '<span style="font-size: 0.6rem; color: #dcba6e; padding: 3px;">N</span>'
                    }
                    break;
            }
        })
    });
});
/* ****************************** CUSTOM COMMON FUNCTION ***************************** */

/*
 * =======================================
 * 踰� 二� : 怨듯넻 - 洹몃━��
 * ��  紐� : Grid 怨듯넻 ��젣 泥섎━ �⑥닔
 * �섏젙�댁뿭: callback 異붽�
 * �묒꽦��/�묒꽦�� : 源��먮�/2021.01.26
 * �섏젙��/�섏젙�� : 怨좏쁽��/2022.03.23
 * =======================================
 */
function fnGridAjaxDel(gridVar, delParamStr, urlStr, callback) {
    $("#delPopSaveBtn").one( "click", function(e) {
        let delIdParam = fnGetDelIdParam(gridVar, delParamStr);

        $.ajax({
            type: "DELETE",
            async: false,
            url: urlStr + delIdParam,
            success: function (data) {
                fnGridCudAjaxSuccess(data, gridVar, $("#delPopSaveBtn"));
                callback();
            }
        });
    });
}