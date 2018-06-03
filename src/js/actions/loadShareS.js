$(document).ready(function () {


    $.ajax({
        url: properties.serverAddress + "/shareS",
        type: "GET",
        contentType: "application/json",
        async: true,
        headers: {
            'Content-Type':'application/x-www-form-urlencoded'
        },
        success: function (data) {

            /*if (data.length === 0) {

                $('#generateCodeButton').hide();

                var alertHTML = '<div class="alert alert-danger" role="alert" id="loginError">' +
                    'Данные не найдены</div>';

                $('#results').append(alertHTML);
            }
            for (var i = 0; i < data.length; i++) {

                var resultsHTML = "";


                var cardClass = parseInt(data[i].mark, 10) >= 70 ? "border-success" : "border-danger";

                var cardHTML = '<div class="row"><div class="card mb-3" id="' + data[i]._id + '" style="max-width: 30rem;">' +
                    '<div class="card-header"><b>' + data[i].title + '</b></div>' +
                    '<div class="card-body text-dark">' + data[i].data +
                    '</div></div><div class="col-sm"></div></div>';

                $('#results').append(cardHTML);
            }*/
        },
        statusCode: {
            301: function (data) {
                window.location = data;
            }
        }
    });

});