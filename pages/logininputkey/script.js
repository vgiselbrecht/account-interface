function logininputkey() {

    var translations = new Array();

    this.onCreate = function (info,trans) {
        this.translations = trans;
        if (user_id == null) {
            $('#inputUserIdGroup').show();
        } else {
            $('#userid').val(user_id);
        }
    }

    this.inputCode = function () {
        $("#inputloginkey .control-label").html('');
        $("#inputloginkey .form-group").removeClass("has-error");
        var code = $('#logincode').val();
        startLoading();
        getJSON("login/inputKey", {login_key: code, user_id: user_id}, function (data) {
            stopLoading();
            if (data["Error"] != undefined) {
                if (data["Error"]["errorCode"] == 1) {
                    $('#inputCodeGroup').addClass("has-error");
                    $('#inputCodeError').html(getTranslationsFromJson(js.translations, "no-code"));
                } else if (data["Error"]["errorCode"] == 2) {
                    $('#inputCodeGroup').addClass("has-error");
                    $('#inputCodeError').html(getTranslationsFromJson(js.translations, "wrong-code"));
                }
            } else {
                loginUser(data['Successful']['remember_key'],data['Successful']['user_id'],true);
            }
        });
    }

}