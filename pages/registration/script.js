function registration() {

    var translations = new Array();

    this.onCreate = function (info,trans) {
        this.translations = trans;
    }

    this.register = function () {
        $("#register .control-label").html('');
        $("#register .form-group").removeClass("has-error");
        var email = $('#registerEmail').val();
        var password = $('#registerPassword').val();
        var password2 = $('#registerPassword2').val();
        if (password != password2) {
            $('#registerPassword2Group').addClass("has-error");
            $('#registerPassword2Error').html(getTranslationsFromJson(this.translations, "password-match"));
        } else {
             startLoading();
            getJSON("register/inputValues", {email: email, password: password}, function (data) {
                stopLoading();
                if (data["Error"] != undefined) {
                    if (data["Error"]["errorCode"] == 2) {
                        $('#registerPasswordGroup').addClass("has-error");
                        $('#registerPasswordError').html(getTranslationsFromJson(js.translations, "password-length"));
                    }else if(data["Error"]["errorCode"] == 1){
                        $('#registerEmailGroup').addClass("has-error");
                        $('#registerEmailError').html(getTranslationsFromJson(js.translations, "email-exists"));
                    } else if(data["Error"]["errorCode"] == 4){
                        $('#registerPasswordGroup').addClass("has-error");
                        $('#registerPasswordError').html(getTranslationsFromJson(js.translations, "password-exists"));
                    }
                    else if(data["Error"]["errorCode"] == 5){
                        $('#registerEmailGroup').addClass("has-error");
                        $('#registerEmailError').html(getTranslationsFromJson(js.translations, "email-wrong"));
                    }
                }else{
                    user_id = data['Successful']['user_id'];
                    insertPage("inputregisterkey");
                }
            });
        }
    }

}