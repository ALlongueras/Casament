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
                var elements = $("#infoSection .content");
                for (var i = 0; i < elements.length; i++) {
                    $(elements[i]).find("h4").addClass("hidden");
                }
                $("#infoSection .content .green").removeClass("green");
                //$("#infoSection .content .green").parent().parent().find("span").addClass("hidden");
                $("#infoSection .content .gray").removeClass("gray");
                $("#infoSection .content .red").removeClass("red");
                //$("#infoSection .content .red").parent().parent().find("span").addClass("hidden");
                if (action == 1) {
                    $(element).addClass("green");
                } else {
                    $(element).addClass("red");
                }
                $(element).parent().parent().find("h4").removeClass("hidden");
            }
        }
    });
}

