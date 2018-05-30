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
            }
            for (var i = 0; i < data.length; i++) {



                var cardHTML = '<div class="row"><div class="card bord-success mb-3" id="' + data[i]._id + '" style="max-width: 30rem;">' +
                    '<div class="card-header"><b>' + data[i].title + '</b></div>' +
                    '<div class="card-body text-dark">' + data[i].data +
                    '</div></div><div class="col-sm"><input type="checkbox" value="' + data[i]._id + '"></div></div>';

                $('#results').append(cardHTML);
            }
        }
    });

});