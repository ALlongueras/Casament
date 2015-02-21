namespace Casament.Controllers
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Web.Http;
    using Archetype.Models;
    using Casament.Models;
    using umbraco;
    using Umbraco.Core.Models;
    using umbraco.MacroEngines;
    using Umbraco.Web;
    using Umbraco.Web.WebApi;

    public class QuizController : UmbracoApiController
    {
        [HttpGet]
        public QuestionAnswerModel GetQuiz(int nodeId, string userId)
        {
            var node = GetQuestionFromRandomSelection(nodeId, userId);
            var questionAnswerModel = new QuestionAnswerModel();
            if (node == null)
            {
                questionAnswerModel.State = "false";
                questionAnswerModel.Result = new QuestionModel();
            }
            else
            {
                questionAnswerModel.State = "true";
                var answers = new List<string>();
                foreach (var answer in Umbraco.TypedContent(node.Id).GetPropertyValue<ArchetypeModel>("answers"))
                {
                    answers.Add(answer.GetValue<string>("answerTitle"));
                }

                questionAnswerModel.Result = new QuestionModel
                {
                    Title = node.GetPropertyValue("questionTitle"),
                    Question = node.GetPropertyValue("question"),
                    Answers = answers,
                    QuestionId = node.Id
                };
            }
            return questionAnswerModel;
        }

        [HttpGet]
        public QuestionAnswerModel GetRestartQuiz(string userId)
        {
            var questionAnswerModel = new QuestionAnswerModel();
            var member = ApplicationContext.Services.MemberService.GetById(int.Parse(userId));
            var attempts = member.Properties.First(x => x.Alias == "attempts").Value;
            var attemptsPuntuation = attempts != null ? int.Parse(attempts.ToString()) : 0;
            member.Properties.First(x => x.Alias == "attempts").Value = attemptsPuntuation + 1;
            if (attemptsPuntuation <= 3)
            {
                questionAnswerModel.State = "true";
                member.Properties.First(x => x.Alias == "puntuation").Value = 0;
                member.Properties.First(x => x.Alias == "questionsAppeared").Value = string.Empty;
                ApplicationContext.Services.MemberService.Save(member);
            }
            else
            {
                questionAnswerModel.State = "false";
            }
            return questionAnswerModel;
        }

        [HttpGet]
        public bool PostQuiz(int questionId, string answer, string userId)
        {
            var member = ApplicationContext.Services.MemberService.GetById(int.Parse(userId));
            var valueCMS = member.Properties.First(x => x.Alias == "puntuation").Value;
            var puntuation = valueCMS != null ? int.Parse(valueCMS.ToString()) : 0;
            var result = this.ValidateAnswerAndUpdateCMS(member, questionId, answer, puntuation);
            valueCMS = member.Properties.First(x => x.Alias == "puntuation").Value;
            puntuation = valueCMS != null ? int.Parse(valueCMS.ToString()) : 0;
            this.UpdateMaxPuntuation(member, puntuation);
            return result;
        }

        [HttpGet]
        public int GetPuntuation(string userId)
        {
            var member = ApplicationContext.Services.MemberService.GetById(int.Parse(userId));
            var valueCMS = member.Properties.First(x => x.Alias == "maxPuntuation").Value;
            return valueCMS != null ? int.Parse(valueCMS.ToString()) : 0;
        }

        private DynamicNode GetQuestionFromRandomSelection(int nodeId, string userId)
        {
            var member = ApplicationContext.Services.MemberService.GetById(int.Parse(userId));
            var attempts = member.Properties.First(x => x.Alias == "attempts").Value;
            var attemptsPuntuation = attempts != null ? int.Parse(attempts.ToString()) : 1;
            if (attemptsPuntuation >= 3)
            {
                return null;
            }

            if (attemptsPuntuation == 0)
            {
                member.Properties.First(x => x.Alias == "attempts").Value = attemptsPuntuation + 1;
            }

            var questionsAnswered = member.Properties.First(x => x.Alias == "questionsAppeared").Value;
            var questionsList = questionsAnswered != null ? questionsAnswered.ToString().Split(',').ToList() : new List<string>();
            var node = new DynamicNode(nodeId);
            var result = node.Descendants().Where(item => !questionsList.Contains(item.Id.ToString())).ToList();

            return result.Any() ? result.GetRandom(1).First() : null;
        }

        private void UpdateQuestionToCMS(int questionId, IMember member)
        {
            var questionsAnswered = member.Properties.First(x => x.Alias == "questionsAppeared").Value;
            member.Properties.First(x => x.Alias == "questionsAppeared").Value = questionsAnswered + "," + questionId;
        }

        private bool ValidateAnswerAndUpdateCMS(IMember member, int questionId, string answer, int puntuation)
        {
            var possibleAnswers = Umbraco.TypedContent(questionId).GetPropertyValue<ArchetypeModel>("answers");
            var correctAnswer = string.Empty;
            foreach (var possibleAnswer in possibleAnswers)
            {
                if (possibleAnswer.GetValue<bool>("correctAnswer"))
                {
                    correctAnswer = possibleAnswer.GetValue<string>("answerTitle");
                }
            }

            if (answer == correctAnswer)
            {
                member.Properties.First(x => x.Alias == "puntuation").Value = puntuation + 1;
                this.UpdateQuestionToCMS(questionId, member);
                ApplicationContext.Services.MemberService.Save(member);
                return true;
            }
            return false;
        }

        private void UpdateMaxPuntuation(IMember member, int puntuation)
        {
            var maxValueCMS = member.Properties.First(x => x.Alias == "maxPuntuation").Value;
            var maxPuntuation = maxValueCMS != null ? int.Parse(maxValueCMS.ToString()) : 0;
            if (puntuation > maxPuntuation)
            {
                member.Properties.First(x => x.Alias == "maxPuntuation").Value = puntuation;
                ApplicationContext.Services.MemberService.Save(member);
            }
        }
    }
}
