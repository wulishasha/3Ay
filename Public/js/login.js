$(function () {
    //获取Cookies信息
    fGetLoginInfo();
    //登录
    fLogin();
    //验证码
    $("#codeImage").click(function () {
        $(this).attr("src", "/View/Login/DrawImage.aspx?temp=" + Math.random());
    });
});

function fLogin() {
    $(".ResBtn").click(function () {
        $("#txtUser").val('');
        $("#txtPassword").val('');
        $("#txtCode").val('');
        $('#codeImage').attr("src", "/View/Login/DrawImage.aspx?temp=" + Math.random());
    });

    $(".SmbBtn").click(function () {
        $("#txtUser").val($.trim($("#txtUser").val()));        
        if ($("#txtUser").val() == "") {
            $("#divError").html("请输入用户名！");
            $("#txtUser").focus();
            return false;
        }
        if ($("#txtPassword").val().length == "") {
            $("#divError").html("请输入密码！");
            $("#txtPassword").focus();
            return false;
        }
        if ($("#txtCode").val().length == "") {
            $("#divError").html("请输入验证码！");
            $("#txtCode").focus();
            return false;
        }
        $("#divError").html("");
        
        $.post("../Handler/Login.ashx",
            {
                type: "LoginIn", username: $("#txtUser").val(), userpwd: $("#txtPassword").val(), checkcode: $("#txtCode").val()
            },
            function (data) {
                
                if (data == "0") {
                    fSaveLoginInfo();
                    fLoginSucc();
                    return;
                }
                $('#codeImage').attr("src", "/View/Login/DrawImage.aspx?temp=" + Math.random());
                if (data == "1") {
                    $("#divError").html("用户名或密码错误");
                }
                if (data == "2") {
                    $("#divError").html("该用户已停用");
                }
                if (data == "3") {
                    $("#divError").html("验证码输入错误");
                }
                if (data == "4") {
                    $("#divError").html("当前用户已经登录，不允许重复登录");
                }
                if (data == "5") 
                {
                    $("#divError").html("该店已经到期，请续费");
                }
                if (data == "6") {
                    layer.alert("软件剩余使用日期已不足一个月，请尽早续费",
                            {
                                title:'到期提示',
                                closeBtn: false,
                                btn: ['确定']
                            },
                               function () {
                                   fSaveLoginInfo();
                                   fLoginSucc();
                                   return;
                               }
                            );
                }
                if (data == "7") {
                    $("#divError").html("当前浏览器中已经登录系统，请关闭浏览器重新登录");
                }
                if (data == "9") {
                    $("#divError").html("数据库连接失败");
                }
                if (data == "10") {
                    $("#divError").html("登录次数过多，请过20分钟重试");
                }
            });
    });

    $('#txtUser').keypress(function () {
        if (event.keyCode == 13 && $(this).val() != "") {
            $('#txtPassword').focus();
        }
    });

    $('#txtPassword').keypress(function () {
        if (event.keyCode == 13 && $(this).val() != "" && $('#txtUser').val != "") {
            $(".SmbBtn").trigger('click');
        }
    });

    $('#txtCode').keypress(function () {
        if (event.keyCode == 13 && $(this).val() != "" && $('#txtCode').val != "" && $('#txtPassword').val != "") {
            $(".SmbBtn").trigger('click');
        }
    });
}

function fSaveLoginInfo() {
    //if ($('input[id="rmbUser"]:checked').val() == "on") {
        $.cookie('rmbName', $("#txtUser").val());
    //} else {
    //    $.cookie('rmbName', null);
    //}
}
function fGetLoginInfo() {
    if ($.cookie('rmbName') != null) {
        $("#txtUser").val($.cookie('rmbName'));
        $('input[id="rmbUser"]').attr('checked', 'on');
        $('#txtPassword').focus();
    }
    else {
        $("#txtUser").focus();
    }
}
function fLoginSucc() {
    window.location.href = "index.aspx";
    //var h2 = screen.availHeight - 10;
    //var w2 = screen.availWidth;
    //sfeature = "top=0,left=0,toolbar=no, menubar=no,scrollbars=no, resizable=yes, location=no, status=yes, width=" + w2 + ",height=" + h2;
    //var aWin = window.open("index.aspx", WindowName(), sfeature);
    //window.opener = null; //可以阻止关闭窗口时的询问框
    //window.close();
}
function WindowName() {
    var d, s = "win";
    var c = "";
    d = new Date();
    s += d.getHours() + c;
    s += d.getMinutes() + c;
    s += d.getSeconds() + c;
    s += d.getMilliseconds();
    return (s);
}