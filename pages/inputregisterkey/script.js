function inputregisterkey() {

    var translations = new Array();

    this.onCreate = function (info, trans) {
        this.translations = trans;
        if (user_id == null) {
            $('#inputUserIdGroup').show();
        } else {
            $('#userid').val(user_id);
        }
    }

    this.inputCode = function () {
        $("#inputregisterkey .control-label").html('');
        $("#inputregisterkey .form-group").removeClass("has-error");
        var code = $('#registercode').val();
        var userId = $('#userid').val();
        startLoading();
        getJSON("register/inputKey", {register_key: code, user_id: userId}, function (data) {
            stopLoading();
            if (data["Error"] != undefined) {
                if (data["Error"]["errorCode"] == 1) {
                    $('#inputCodeGroup').addClass("has-error");
                    $('#inputCodeError').html(getTranslationsFromJson(js.translations, "no-code"));
                } else if (data["Error"]["errorCode"] == 2) {
                    $('#inputCodeGroup').addClass("has-error");
                    $('#inputCodeError').html(getTranslationsFromJson(js.translations, "wrong-code"));
                } else if (data["Error"]["errorCode"] == 4) {
                    $('#inputUserIdGroup').addClass("has-error");
                    $('#inputUserIdError').html(getTranslationsFromJson(js.translations, "no-userid"));
                } else if (data["Error"]["errorCode"] == 5) {
                    $('#inputUserIdGroup').addClass("has-error");
                    $('#inputUserIdError').html(getTranslationsFromJson(js.translations, "wrong-userid"));
                }
            } else {
                loginUser(data['Successful']['remember_key'], data['Successful']['user_id'], true);
            }
        });
    }

}