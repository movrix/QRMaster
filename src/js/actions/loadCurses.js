$(document).ready(function () {

    $.ajax({
        url: properties.serverAddress + properties.userdata,
        type: "GET",
        contentType: "application/json",
        async: false,
        success: function (data) {

            if (data.length === 0) {

                $('#generateCodeButton').hide();

                var alertHTML = '<div class="alert alert-danger" role="alert" id="loginError">' +
                    'Результаты тестов для данного пользователя не найдены</div>';

                $('#results').append(alertHTML);
                return;
            }

            $('#results').append('<div class="list-group"></div>');

            var HTML;
            for (var i = 0; i < data.length; i++) {


                HTML = '<a href="/course?name=' + data[i].title + '" class="list-group-item list-group-item-action">' +
                 data[i].title + '</a>';

                $('#results').append(HTML);
            }
        }
    });
});