$(document).ready(function () {
    $("#infoSection a.icon").click(function () {
        event.preventDefault();
        var userId = $(".quiz").data("user");
        var action = $(this).data("value");
        UpdateAssistance(this, userId, action);
    });
});

function UpdateAssistance(element, userId, action) {
    $.ajax({
        url: "http://local.casament.com/Umbraco/Api/Assistance/UpdateAssistance?id=" + userId + "&action=" + action,
        type: 'GET',
        async: true,
        dataType: "json",
        contentType: 'application/json, charset=utf-8',
        success: function (data) {
            if (data == true) {
                $("#infoSection .content .green").removeClass("green");
                $("#infoSection .content .gray").removeClass("gray");
                $(element).addClass("green");
            }
        }
    });
}

