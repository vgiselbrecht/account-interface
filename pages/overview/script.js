function overview() {
    var translations = new Array();

    this.onCreate = function (info,trans) {
        this.translations = trans;
    }
}