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
});

function ShowInitialQuestion() {
    $.ajax({
        url: "http://local.casament.com/Umbraco/Api/Quiz/GetQuiz?nodeId=1065",
        type: 'GET',
        async: true,
        dataType: "json",
        contentType: 'application/json, charset=utf-8',
        success: function (data) {
            PaintData(data);

            $("#buttonsSelector").removeClass("hidden");

            var element = $('[data-type=button]');
            element.remove();
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
            GetNewQuestion();
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
        alert("Yo have won!");
    } else {
        $(".section-title").text(data.Result.Title);
        $(".questionContent").html(data.Result.Question).text();
        $("#buttonsSelector").attr("data-node", data.Result.QuestionId);
        $('[data-type=answer1]').find("button").text(data.Result.Answer1);
        $('[data-type=answer2]').find("button").text(data.Result.Answer2);
        $('[data-type=answer3]').find("button").text(data.Result.Answer3);
        $('[data-type=answer4]').find("button").text(data.Result.Answer4);
    }

}