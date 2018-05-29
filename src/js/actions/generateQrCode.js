$(document).ready(function() {

    var list = [];
    var qrcode;
    var qrText;

    $('#generateCodeButton').click(function () {

        qrText = properties.serverAddress + "/share?";
        list = [];

        $("input:checkbox:checked").each(function(){
            list.push($(this).val());
        });

        for (var i = 0; i < list.length; i++ ) {
            qrText += "id=" + list[i] + "&";
        }

        if (typeof qrcode == 'undefined') {
            qrcode = new QRCode("qrcode", {
                text: qrText,
                width: 512,
                height: 512,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
        } else {
            qrcode.makeCode(qrText);
        }
    });
});