$(function() {
    /**
     * =======================================
     * 설  명 : init
     * =======================================
     */   
    $("#registerTitle").focus();


    /**
     * =======================================
     * 설  명 : 파일 업로드 썸네일
     * =======================================
     */   

    let fileTarget = $('.filebox .upload-hidden');

    fileTarget.on('change', function(){
        if(window.FileReader){
            // 파일명 추출
            let filename = $(this)[0].files[0].name;
            $(this).siblings('.upload-name').val(filename);
        } 

        else {
            // Old IE 파일명 추출
            let filename = $(this).val().split('/').pop().split('\\').pop();
            $(this).siblings('.upload-name').val(filename);
        };
        
    });

    //preview image 
    let imgTarget = $('.preview-image .upload-hidden');

    imgTarget.on('change', function(){
        let parent = $(this).parent();
        parent.children('.upload-display').remove();

        if(window.FileReader){
            //image 파일만
            if (!$(this)[0].files[0].type.match(/image\//)) return;
            
            let reader = new FileReader();
            reader.onload = function(e){
                let src = e.target.result;
                parent.prepend('<div class="upload-display"><div class="upload-thumb-wrap"><img src="'+src+'" class="upload-thumb"></div></div>');
            }
            reader.readAsDataURL($(this)[0].files[0]);
        }

        else {
            $(this)[0].select();
            $(this)[0].blur();
            let imgSrc = document.selection.createRange().text;
            parent.prepend('<div class="upload-display"><div class="upload-thumb-wrap"><img class="upload-thumb"></div></div>');

            let img = $(this).siblings('.upload-display').find('img');
            img[0].style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(enable='true',sizingMethod='scale',src=\""+imgSrc+"\")";        
        }
    });
    
    /**
     * =======================================
     * 설  명 : summernote lib
     * =======================================
     */   
     $('#summernote').summernote({
        height: 300,                 // set editor height
        minHeight: null,             // set minimum height of editor
        maxHeight: null,             // set maximum height of editor
        focus: false,                  // set focus to editable area after initializing summernote
        styleTags: [
            'p',{ title: 'Blockquote', tag: 'blockquote', className: 'blockquote', value: 'blockquote' },
            'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
        ],
        lineHeights: ['0.2', '0.3', '0.4', '0.5', '0.6', '0.8', '1.0', '1.2', '1.4', '1.5', '2.0', '3.0'],
        fontNames: ['Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Merriweather'],
        fontNamesIgnoreCheck: ['Merriweather'],
        toolbar: [
            ['style', ['style']], 
            ['font', ['bold', 'underline', 'clear']],
            ['fontname', ['fontname']],
            ['fontsize', ['fontsize']],
            ['height', ['height']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['table', ['table']],
            ['insert', ['link', 'picture', 'video']]
        ],
        callbacks: {
            onImageUpload : function(files) {
                sendFile(files[0], this);
            }
        }
      });

      function sendFile(file, editor){
        let data = new FormData()
        data.append("summerfile", file);

        $.ajax({
          data: data,
          type: "POST",
          url : "/admin/board/uploads",
          enctype: "multipart/form-data",
          contentType: false,
          processData: false,
          success: function (response) {
            let url = location.origin + response;
            let imgurl = $('<img>').attr({
               'src': url
            });
            $("#summernote").summernote("insertNode", imgurl[0]);
          },
        })
      }


    /**
     * =======================================
     * 설  명 : 등록 취소 버튼
     * =======================================
     */   
    $("#boardCancelBtn").on("click",function(){
        history.go(-1);
    });

    /**
     * =======================================
     * 설  명 : 글쓰기 등록
     * =======================================
     */   
    $("#boardAddBtn").on("click", function(){
        let boardAddForm = $("#boardAddForm").validate({
            rules: {
                title: {
                    required: true
                },
            },
            messages: {
                title: {
                    required: "필수 항목입니다."
                }
            },
            submitHandler: function(form) {
                $("#summerContents").val(getEditorContents("#summernote"));
                let formData = new FormData($("#boardAddForm")[0]);

                $.ajax({
                    type : "POST",
                    url : "/admin/board/boardAddProcess",
                    dataType : "JSON",
                    enctype: "multipart/form-data",
                    contentType: false,
                    processData: false,
                    data : formData
                })
                .done(function(json){
                    if(json.mainId === "1"){
                        window.location = "/admin/manage/1/page/1#pr" + json.subId ;
                    }else{
                        window.location = "/admin/manage/1/page/1#ar" + json.subId ;
                    }
                })
                .fail(function(xhr, status, errorThrown){
                    console.log("글쓰기 등록 Ajax failed")
                })
            }
        });            
    });

    /*
     * =======================================
     * 설  명 : summernote 에디터에 작성한 HTML의 값을 얻는다.
     * =======================================
     */
    function getEditorContents(selectHtmlQuery) {
        return $(selectHtmlQuery).summernote("code");
    }
});

