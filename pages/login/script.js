function login() {

    var translations = new Array();

    this.onCreate = function (info, trans) {
        this.translations = trans;
        var email = $("#navbar-not-login input[name='email']").val();
        var password = $("#navbar-not-login input[name='password']").val();
        $('#loginEmail').val(email);
        $('#loginPassword').val(password);
        this.handleErrors(info);
    }

    this.handleErrors = function (error) {
        $("#login .control-label").html('');
        $("#login .form-group").removeClass("has-error");
        switch (error) {
            case 1:
                $('#loginEmailGroup').addClass("has-error");
                $('#loginEmailError').html(getTranslationsFromJson(this.translations, "no-email"));
                break;
            case 2:
                $('#loginPasswordGroup').addClass("has-error");
                $('#loginPasswordError').html(getTranslationsFromJson(this.translations, "no-password"));
                break;
            case 3:
                $('#loginEmailGroup').addClass("has-error");
                $('#loginEmailError').html(getTranslationsFromJson(this.translations, "wrong-email"));
                break;
            case 4:
                $('#loginEmailGroup').addClass("has-error");
                $('#loginEmailError').html(getTranslationsFromJson(this.translations, "email-not-exists"));
                break;
            case 5:
                $('#loginPasswordGroup').addClass("has-error");
                $('#loginPasswordError').html(getTranslationsFromJson(this.translations, "wrong-password"));
                break;
            case 5:
                $('#loginEmailGroup').addClass("has-error");
                $('#loginEmailError').html(getTranslationsFromJson(this.translations, "account-not-verified"));
                break;
        }
    }

    this.doLogin = function () {
        var email = $('#loginEmail').val();
        var password = $('#loginPassword').val();
        startLoading();
        getJSON("login/inputValues", {email: email, password: password}, function (data) {
            stopLoading();
            if (data["Error"] != undefined) {
                js.handleErrors(data["Error"]["errorCode"]);
            } else {
                user_id = data['Successful']['user_id'];
                insertPage('logininputkey');
            }
        });
    }

}