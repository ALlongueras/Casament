$(document).ready(function () {
    $(".startQuiz").click(function (event) {
        event.preventDefault();
        ShowInitialQuestion();
    });
    $("#buttonsSelector button").click(function () {
        var questionId = $("#buttonsSelector").attr("data-node");
        var answer = this.parentElement.parentElement.dataset.type;
        SendAnswerSelected(questionId, answer);
    });
    $(".buttonSelector .restartQuiz").click(function() {
        RestartQuiz();
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

function ShowInitialQuestion() {
    $.ajax({
        url: "http://local.casament.com/Umbraco/Api/Quiz/GetQuiz?nodeId=1065",
        type: 'GET',
        async: true,
        dataType: "json",
        contentType: 'application/json, charset=utf-8',
        success: function (data) {
            if (data.State == "true") {
                PaintData(data);
            } else {
                AllAttemptsCompleted();
            }
        }
    });
}

function RestartQuiz() {
    $.ajax({
        url: "http://local.casament.com/Umbraco/Api/Quiz/GetRestartQuiz",
        type: 'GET',
        async: true,
        dataType: "json",
        contentType: 'application/json, charset=utf-8',
        success: function (data) {
            if (data.State == "true") {
                $(".buttonSelector .restartQuiz").addClass("hidden");
                ShowInitialQuestion();
            } else {
                AllAttemptsCompleted();
            }
        }
    });
}

function SendAnswerSelected(questionId, answer) {
    $.ajax({
        url: "http://local.casament.com/Umbraco/Api/Quiz/PostQuiz?questionId=" + questionId + "&answer=" + answer,
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
                GetNewQuestion();
            }
        }
    });
}

function GetNewQuestion() {
    $.ajax({
        url: "http://local.casament.com/Umbraco/Api/Quiz/GetQuiz?nodeId=1065",
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
        $('[data-type=answer1]').find("button").text(data.Result.Answer1);
        $('[data-type=answer2]').find("button").text(data.Result.Answer2);
        $('[data-type=answer3]').find("button").text(data.Result.Answer3);
        $('[data-type=answer4]').find("button").text(data.Result.Answer4);
        $(".questionContent").removeClass("hidden");
        $("#buttonsSelector").removeClass("hidden");
        $(".buttonSelector .startQuiz").addClass("hidden");
    }

}

function AllAttemptsCompleted() {
    $(".section-title").text("Has esgotat tot els intents possibles");
    $(".questionContent").addClass("hidden");
    $(".buttonSelector .startQuiz").addClass("hidden");
}