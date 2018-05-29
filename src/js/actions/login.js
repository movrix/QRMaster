$(document).ready(function() {

    $('#register').click(function () {
        window.location = '/registration';
    });

    $('#loginButton').click(function () {

        var form = $("form");
        var data = form.serializeArray();
        $.ajax({
            method: 'POST',
            url: '/api/login',
            dataType: "json",
            contentType: "application/json",
            crossDomain: true,
            data: JSON.stringify(getFormData(data)),
            statusCode: {
                200: function () {
                    $("#loginError").hide();
                    window.location = '/';
                },
                400: function () {
                    $("#loginError").show();
                }
            }
        });
    });

    $('#logoutButton').click(function () {

        $.ajax({
            method: 'GET',
            url: '/api/logout',
            crossDomain: true,
            statusCode: {
                200: function () {
                    window.location = '/';
                },
                400: function () {
                    window.location = '/';
                }
            }
        });
    });

});