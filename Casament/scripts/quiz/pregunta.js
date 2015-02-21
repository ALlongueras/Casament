var currentHost = window.location.origin;
var nodeId = $('input[name=quizNode]').val();
var email = $('input[name=email]').val();
$(document).ready(function () {
    $(".startQuiz").click(function (event) {
        event.preventDefault();
        var userId = $(".quiz").data("user");
        ShowInitialQuestion(userId);
    });
    $("#buttonsSelector button").click(function () {
        var questionId = $("#buttonsSelector").attr("data-node");
        var userId = $(".quiz").data("user");
        var answer = this.textContent;
        SendAnswerSelected(questionId, answer, userId);
    });
    $(".buttonSelector .restartQuiz").click(function() {
        var userId = $(".quiz").data("user");
        RestartQuiz(userId);
    });

    $("#enviarFormulari").click(function() {
        event.preventDefault();
        SendEmailContact();
    });
});

function SendEmailContact() {
    $(".form-group p").addClass("hidden");
    $(".form-loader").fadeIn("fast");
    var consulta = $('textarea[name="message"]').val();
    $.ajax({
        url: currentHost + "/Umbraco/Api/ContactForm/GetConsultForm?consulta=" + consulta + "&email=" + email,
        type: 'GET',
        async: true,
        dataType: "json",
        contentType: 'application/json, charset=utf-8',
        success: function () {
            $(".form-group p").removeClass("hidden");
            $(".form-loader").fadeOut("fast");
            //alert("enviat!!");
        }
    });
}

function ShowInitialQuestion(userId) {
    $.ajax({
        url: currentHost + "/Umbraco/Api/Quiz/GetQuiz?nodeId=" + nodeId +"&userId=" + userId,
        type: 'GET',
        async: true,
        dataType: "json",
        contentType: 'application/json, charset=utf-8',
        success: function (data) {
            if (data.State == "true") {
                PaintData(data);
            } else {
                AllAttemptsCompleted(userId);
            }
        }
    });
}

function RestartQuiz(userId) {
    $.ajax({
        url: currentHost + "/Umbraco/Api/Quiz/GetRestartQuiz?userId=" + userId,
        type: 'GET',
        async: true,
        dataType: "json",
        contentType: 'application/json, charset=utf-8',
        success: function (data) {
            if (data.State == "true") {
                $(".buttonSelector .restartQuiz").addClass("hidden");
                ShowInitialQuestion(userId);
            } else {
                AllAttemptsCompleted(userId);
            }
        }
    });
}

function SendAnswerSelected(questionId, answer, userId) {
    $.ajax({
        url: currentHost + "/Umbraco/Api/Quiz/PostQuiz?questionId=" + questionId + "&answer=" + answer + "&userId=" + userId,
        type: 'GET',
        async: true,
        dataType: "json",
        contentType: 'application/json, charset=utf-8',
        success: function (data) {
            if (data == false) {
                $(".quiz .section-title").text("Ohhh has fallat");
                GetPuntuation(userId);
                //$(".quiz .questionContent").addClass("hidden");
                $("#buttonsSelector").addClass("hidden");
                $(".buttonSelector .restartQuiz").removeClass("hidden");
            } else {
                GetNewQuestion(userId);
            }
        }
    });
}

function GetNewQuestion(userId) {
    $.ajax({
        url: currentHost + "/Umbraco/Api/Quiz/GetQuiz?nodeId=" + nodeId + "&userId=" + userId,
        type: 'GET',
        async: true,
        dataType: "json",
        contentType: 'application/json, charset=utf-8',
        success: function (data) {
            PaintData(data);
        }
    });
}

function PaintData(data) {
    if (data.State == "false") {
        $("#buttonsSelector").addClass("hidden");
        $(".buttonSelector .restartQuiz").removeClass("hidden");
    } else {
        $(".quiz .section-title").text(data.Result.Title);
        $(".quiz .questionContent").html(data.Result.Question).text();
        $("#buttonsSelector").attr("data-node", data.Result.QuestionId);
        for (var i = 0; i < data.Result.Answers.length; i++) {
            $('[data-type=answer' + i + ']').find("button").text(data.Result.Answers[i]);
        }
        $(".quiz .questionContent").removeClass("hidden");
        $("#buttonsSelector").removeClass("hidden");
        $(".buttonSelector .startQuiz").addClass("hidden");
    }

}

function GetPuntuation(userId) {
    $.ajax({
        url: currentHost + "/Umbraco/Api/Quiz/GetPuntuation?userId=" + userId,
        type: 'GET',
        async: true,
        dataType: "json",
        contentType: 'application/json, charset=utf-8',
        success: function (data) {
            $(".quiz .questionContent").text("La teva puntuació es de: " + data);
        }
    });
}

function AllAttemptsCompleted(userId) {
    $(".quiz .section-title").text("Has esgotat tot els intents possibles");
    GetPuntuation(userId);
    //$(".questionContent").addClass("hidden");
    $(".buttonSelector .startQuiz").addClass("hidden");
}