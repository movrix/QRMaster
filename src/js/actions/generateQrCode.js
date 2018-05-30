$(document).ready(function() {

    var list = [];
    var qrcode;
    var qrText;

    function generate(text) {
        if (typeof qrcode == 'undefined') {
            qrcode = new QRCode("qrcode", {
                text: text,
                width: 256,
                height: 256,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
        } else {
            qrcode.makeCode(text);
        }
    }

    $('#generateCodeButton').click(function () {

        qrText = properties.serverAddress + "/share/";

        list = [];

        $("input:checkbox:checked").each(function(){
            list.push($(this).val());
        });

        var ids = "";
        for (var i = 0; i < list.length; i++ ) {
            ids += "id=" + list[i] + "&";
        }

        var shareId = $.ajax({
            url: properties.serverAddress + "/makeshare?" + ids + "toUserType=teacher",
            type: "GET",
            contentType: "text",
            async: false,
            success: function (data) {
                qrText += data.toString();
                alert(qrText);
            }
        });


        generate(qrText)
    });

    $('#generateCodeButtonTeacher').click(function () {

        qrText = properties.serverAddress + "/share/";

        list = [];

        $("input:checkbox:checked").each(function(){
            list.push($(this).val());
        });

        if (list.length === 0) {
            alert("Выберите хотя бы 1 документ");
            return;
        }

        var ids = "";
        for (var i = 0; i < list.length; i++ ) {
            ids += "id=" + list[i] + "&";
        }

        var toUserType = "all";

        var forUser = $('#forUser').val();
        var forGroup = $('#forGroup').val();
        if (forUser !== "" || forGroup !== "") {
            toUserType = "student";
        }

        var shareId = $.ajax({
            url: properties.serverAddress + "/makeshare?" + ids + "toUserType=" + toUserType + "&toUser=" + forUser + "&toGroup=" + forGroup,
            type: "GET",
            contentType: "text",
            async: false,
            success: function (data) {
                qrText += data.toString();
                alert(qrText);
            }
        });


        generate(qrText)
    });
});