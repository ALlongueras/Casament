var currentHost = window.location.origin;
$(document).ready(function () {
    $("#infoSection a.icon").click(function () {
        event.preventDefault();
        var userId = $(".quiz").data("user");
        var action = $(this).data("value");
        UpdateAssistance(this, userId, action);
    });

    $("#main-menu .menu-item a").click(function() {
        toggle_main_menu();
    });
});

function UpdateAssistance(element, userId, action) {
    $.ajax({
        url: currentHost + "/Umbraco/Api/Assistance/UpdateAssistance?id=" + userId + "&action=" + action,
        type: 'GET',
        async: true,
        dataType: "json",
        contentType: 'application/json, charset=utf-8',
        success: function (data) {
            if (data == true) {
                $("#infoSection .content .green").removeClass("green");
                $("#infoSection .content .gray").removeClass("gray");
                $("#infoSection .content .red").removeClass("red");
                if (action == 1) {
                    $(element).addClass("green");
                } else {
                    $(element).addClass("red");
                }
            }
        }
    });
}

