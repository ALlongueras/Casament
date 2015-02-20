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
        SendEmailContact();
    });
});

function SendEmailContact() {
    $.ajax({
        url: "http://local.casament.com/Umbraco/Api/ContactForm/GetConsultForm?name=albert&consulta=bon dia&email=nuriapelegri@gmail.com",
        type: 'GET',
        async: true,
        dataType: "json",
        contentType: 'application/json, charset=utf-8',
        success: function () {
            alert("enviat!!");
        }
    });
}

function ShowInitialQuestion(userId) {
    $.ajax({
        url: "http://local.casament.com/Umbraco/Api/Quiz/GetQuiz?nodeId=1089&userId=" + userId,
        type: 'GET',
        async: true,
        dataType: "json",
        contentType: 'application/json, charset=utf-8',
        success: function (data) {
            if (data.State == "true") {
                PaintData(data);
            } else {
                GetPuntuation(userId);
            }
        }
    });
}

function RestartQuiz(userId) {
    $.ajax({
        url: "http://local.casament.com/Umbraco/Api/Quiz/GetRestartQuiz?userId=" + userId,
        type: 'GET',
        async: true,
        dataType: "json",
        contentType: 'application/json, charset=utf-8',
        success: function (data) {
            if (data.State == "true") {
                $(".buttonSelector .restartQuiz").addClass("hidden");
                ShowInitialQuestion(userId);
            } else {
                AllAttemptsCompleted();
            }
        }
    });
}

function SendAnswerSelected(questionId, answer, userId) {
    $.ajax({
        url: "http://local.casament.com/Umbraco/Api/Quiz/PostQuiz?questionId=" + questionId + "&answer=" + answer + "&userId=" + userId,
        type: 'GET',
        async: true,
        dataType: "json",
        contentType: 'application/json, charset=utf-8',
        success: function (data) {
            if (data == false) {
                $(".section-title").text("Ohhh has fallat");
                $(".questionContent").addClass("hidden");
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
        url: "http://local.casament.com/Umbraco/Api/Quiz/GetQuiz?nodeId=1089&userId=" + userId,
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
        $(".section-title").text(data.Result.Title);
        $(".questionContent").html(data.Result.Question).text();
        $("#buttonsSelector").attr("data-node", data.Result.QuestionId);
        for (var i = 0; i < data.Result.Answers.length; i++) {
            $('[data-type=answer' + i + ']').find("button").text(data.Result.Answers[i]);
        }
        $(".questionContent").removeClass("hidden");
        $("#buttonsSelector").removeClass("hidden");
        $(".buttonSelector .startQuiz").addClass("hidden");
    }

}

function GetPuntuation(userId) {
    $.ajax({
        url: "http://local.casament.com/Umbraco/Api/Quiz/GetPuntuation?userId=" + userId,
        type: 'GET',
        async: true,
        dataType: "json",
        contentType: 'application/json, charset=utf-8',
        success: function (data) {
            AllAttemptsCompleted(data);
        }
    });
}

function AllAttemptsCompleted(data) {
    $(".quiz .section-title").text("Has esgotat tot els intents possibles");
    $(".quiz .questionContent").text("La teva puntuació es de: " + data);
    //$(".questionContent").addClass("hidden");
    $(".buttonSelector .startQuiz").addClass("hidden");
}