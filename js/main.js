
var loginstate = false;
var app_id = 1;
var user_id = null;
var remember_key = null;
var lang = "de";
var js = null;

$.ajaxSetup({
    cache: false
});

$(document).ready(function () {
    checkRememberUser();
    checkLoginStatus();
    insertTranslations();
    openPage();
});

function checkRememberUser() {
    if (get_cookie('user_id')) {
        user_id = get_cookie('user_id');
    }
    if (get_cookie('remember_key')) {
        remember_key = get_cookie('remember_key');
    }
    if (user_id && remember_key) {
        loginstate = true;
    }
}

function checkLoginStatus() {
    if (loginstate) {
        $("#navbar-login").show();
        $("#navbar-not-login").hide();
    } else {
        $("#navbar-login").hide();
        $("#navbar-not-login").show();
    }
}

function openPage() {
    if (window.location.hash) {
        insertPage(window.location.hash.substring(1));
    } else {
        if (!loginstate) {
            insertPage("registration");
        } else {
            insertPage("overview");
        }
    }
    $(window).on('hashchange', function () {
        insertPage(window.location.hash.substring(1));
    });
}

function insertPage(pagename, info) {
    startLoading();
    $.getJSON("pages/" + pagename + "/config.json", function (json) {
        if (json.login != null && loginstate != json.login) {
            insertPage("permissiondenied");
        } else {
            $.getScript("pages/" + pagename + "/script.js", function (scriptdata, textStatus, jqxhr) {
                $.get("pages/" + pagename + "/style.css", function (css) {
                    $("head").append("<style type='text/css'>" + css + "</style>");
                    $.get("pages/" + pagename + "/template.html", function (data) {
                        $("#main").html(data);
                        $.getJSON("pages/" + pagename + "/translation/" + lang + ".json", function (json) {
                            insertTranslationInArea(json);
                            js = eval("new " + pagename + "()");
                            js.onCreate(info, json);
                            stopLoading();
                        });
                    });
                });
            });
        }
    });

    //window.location.hash = pagename;
}

function startLoading() {
    $("#loader").show();
}

function stopLoading() {
    $("#loader").hide();
}

function doLogin() {
    startLoading();
    var email = $("#navbar-not-login input[name='email']").val();
    var password = $("#navbar-not-login input[name='password']").val();
    getJSON("login/inputValues", {email: email, password: password}, function (data) {
        stopLoading();
        if (data["Error"] != undefined) {
            insertPage('login', data["Error"]["errorCode"]);
        } else {
            user_id = data['Successful']['user_id'];
            insertPage('logininputkey');
        }
    });
}

function doLogout() {
    startLoading();
    getJSON("login/logout", null, function (data) {
        stopLoading();
        loginstate = false;
        remember_key = null;
        user_id = null;
        insertPage("registration");
        checkLoginStatus();
        delete_cookie('user_id');
        delete_cookie('remember_key');
    });
}

function insertTranslations() {
    $.getJSON("translation/" + lang + ".json", function (json) {
        insertTranslationInArea(json);
    });
}

function insertTranslationInArea(json) {
    jQuery.each(json, function (key, val) {
        $("[trans-html=" + key + "]").each(function () {
            $(this).html(val);
        });
        $("[trans-placeholder=" + key + "]").each(function () {
            $(this).attr('placeholder', val);
        });
        $("[trans-value=" + key + "]").each(function () {
            $(this).val(val);
        });
        $("[trans-title=" + key + "]").each(function () {
            $(this).attr('title', val);
        });
    });
}

function getTranslationsFromJson(json, key) {
    var re = "";
    jQuery.each(json, function (key2, val) {
        if (key2 == key) {
            re = val;
        }
    });
    return re;
}

function loginUser(rkey, uid, remember) {
    loginstate = true;
    remember_key = rkey;
    user_id = uid;
    insertPage("overview");
    checkLoginStatus();
    if (remember) {
        set_cookie('user_id', user_id);
        set_cookie('remember_key', remember_key);
    }
}

function getJSON(method, post, callback) {
    method = method + "/" + app_id;
    if (user_id != null) {
        method = method + "/" + user_id;
        if (remember_key != null) {
            method = method + "/" + remember_key;
        }
    }
    $.ajax({
        url: 'proxy.php/' + method,
        type: 'POST',
        data: post,
        dataType: 'json',
        success: function (data) {

            callback(data);
        }
    });
}

function get_cookie(cookieName)
{
    strValue = "";

    if (strCookie = document.cookie)
    {
        if (arrCookie = strCookie.match(new RegExp(cookieName + '=([^;]*)', 'g')))
        {
            strValue = RegExp.$1;
        }
    }
    return(strValue);
}

function set_cookie(cookieName, cookieValue)
{
    if (!this.isCookieEnabled())
    {
        return false;
    }
    var date = new Date();
    date.setTime(date.getTime() + (10 * 365 * 24 * 60 * 60 * 1000));
    document.cookie = cookieName + '=' +
            cookieValue + '; expires=' + date.toGMTString() + ';';
    return true;
}

function delete_cookie(cookieName)
{
    if (document.cookie)
    {
        document.cookie = cookieName + '=' +
                this.get_cookie(cookieName) +
                ';expires=Thu, 01-Jan-1970 00:00:01 GMT;';
        return true;
    }
    return false;
}

function isCookieEnabled()
{
    if (typeof navigator.cookieEnabled != 'undefined')
    {
        return navigator.cookieEnabled;
    }

    this.set_cookie('testcookie', 'testwert', 1);

    if (!document.cookie)
    {
        return false;
    }

    this.delete_cookie('testcookie');
    return true;
}