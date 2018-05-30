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

                var resultsHTML = "";

                if (typeof data[i].results === "undefined") {
                    console.log("Data for student is not available")
                } else {

                    for (var j = 0; j < data[i].results.length; j++) {

                        resultsHTML += '<div class="alert alert-primary" role="alert">' +
                            data[i].results[j].question +
                            '</div><p><b>Правильный ответ:</b>' + data[i].results[j].trueAnswer +
                            '<br> <b>Ответ студента:</b> ' + data[i].results[j].userAnswer + '</p>';
                    }
                }


                var cardClass = parseInt(data[i].mark, 10) >= 70 ? "border-success" : "border-danger";

                var cardHTML = '<div class="row"><div class="card ' + cardClass + ' mb-3" id="' + data[i]._id + '" style="max-width: 30rem;">' +
                    '<div class="card-header"><b>' + data[i].title + '</b><br>Дата попытки: ' + data[i].passDate + '<br> Результат: ' + data[i].mark + ' из 100</div>' +
                    '<div class="card-body text-dark">' + results +
                    '</div></div><div class="col-sm"><input type="checkbox" value="' + data[i]._id + '"></div></div>';

                $('#results').append(cardHTML);
            }
        }
    });

});