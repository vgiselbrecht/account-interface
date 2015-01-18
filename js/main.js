
var login = false;

$(document).ready(function () {
    checkLoginStatus();
    openPage();
});

function checkLoginStatus() {
    if (login) {
        $("#navbar-login").show();
        $("#navbar-not-login").hide();
    } else {
        $("#navbar-login").hide();
        $("#navbar-not-login").show();
    }
}

function openPage() {
    if (!login) {
        insertPage("registration");
    } else {
        if (window.location.hash) {
            insertPage(window.location.hash.substring(1));
        } else {
            insertPage("overview");
        }
    }
    $(window).on('hashchange', function () {
        insertPage(window.location.hash.substring(1));
    });
}

function insertPage(pagename) {
    $.get("pages/" + pagename + ".html", function (data) {
        $("#main").html(data);
    });
    //window.location.hash = pagename;
}

function doLogin() {
    var email = $("#navbar-not-login input[name='email']").val();
    var password = $("#navbar-not-login input[name='password']").val();
}

function getJSON(method, callback) {
    $.ajax({
        url: "http://api.account.local/".method,
        // The name of the callback parameter, as specified by the YQL service
        jsonp: "jsonp",
        // Tell jQuery we're expecting JSONP
        dataType: "jsonp",
        // Work with the response
        type: 'GET',
        success: function (response) {
            callback(response);
        }
    });
}