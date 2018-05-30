properties = {
    serverAddress: 'http://localhost:8080',
    userdata: '/api/userdata',
    username: '/api/username'
};

$(document).ready(function () {

    $.ajax({
        url: properties.serverAddress + properties.username,
        type: "GET",
        contentType: "text",
        async: true,
        success: function (data) {
            $('#login').append(data);
        }
    });

});