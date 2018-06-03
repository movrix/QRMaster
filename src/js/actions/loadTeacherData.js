$(document).ready(function () {

    var getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    };

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

            $('#results').append('<div id="accordion">');

            var HTML;
            for (var i = 0; i < data.length; i++) {

                if (getUrlParameter("name") !== data[i].title ) {
                    continue;
                }

                HTML = '<div class="card">' +
                          '<div class="card-header" id="headingOne">' +
                                '<h5 class="mb-0">' +
                                    '<button class="btn btn-link" data-toggle="collapse" data-target="#collapseOne' + i + '"' +
                                        'aria-expanded="true" aria-controls="collapseOne">' +
                                            data[i].title +
                                    '</button>' +
                                '</h5>' +
                          '</div>' +
                          '<div id="collapseOne' + i + '"' + 'class="collapse" aria-labelledby="headingOne" data-parent="#accordion">' +
                                '<div class="card-body">';

                HTML += '<table class="table">' +
                    '<thead>' +
                        '<tr>' +
                            '<th scope="col">Тема</th>' +
                            '<th scope="col">Ссылка</th>' +
                            '<th scope="col"></th>' +
                        '</tr>' +
                    '</thead><tbody>';
                for (var j = 0; j < data[i].themes.length; j++) {
                    HTML += '<tr>' +
                                '<td>' + data[i].themes[j].title + '</td>' +
                                '<td>' + data[i].themes[j].link + '</td>' +
                                '<td>' +
                                    '<div class="form-check">\n' +
                                        '<input class="form-check-input" type="radio" name="exampleRadios" id="exampleRa" value="' + data[i].themes[j].link + '">\n' +
                                    '</div>' +
                                '</td>' +
                            '</tr>';
                }
                HTML += '</tbody></table></div></div></div>';

                $('#results').append(HTML);
            }
        }
    });
});