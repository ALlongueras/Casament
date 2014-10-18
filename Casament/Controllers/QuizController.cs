using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Casament.Models;
using ICSharpCode.SharpZipLib.Zip;
using umbraco;
using umbraco.cms.businesslogic.web;
using Umbraco.Core.Models.Membership;
using umbraco.MacroEngines;
using Umbraco.Web.WebApi;

namespace Casament.Controllers
{
    public class QuizController : UmbracoApiController
    {
        [HttpGet]
        public QuestionAnswerModel GetQuiz(int nodeId)
        {
            var node = GetQuestionFromRandomSelection(nodeId);
            var questionAnswerModel = new QuestionAnswerModel();
            if (node == null)
            {
                questionAnswerModel.State = "false";
                questionAnswerModel.Result = new QuestionModel();
            }
            else
            {
                questionAnswerModel.State = "true";
                questionAnswerModel.Result = new QuestionModel
                {
                    Title = node.Name,
                    //Answer = node.GetPropertyValue("answer"),
                    Question = node.GetPropertyValue("question"),
                    Answer1 = node.GetPropertyValue("answer1"),
                    Answer2 = node.GetPropertyValue("answer2"),
                    Answer3 = node.GetPropertyValue("answer3"),
                    Answer4 = node.GetPropertyValue("answer4"),
                    QuestionId = node.Id
                };
            }
            return questionAnswerModel;
        }

        [HttpGet]
        public bool PostQuiz(int questionId, string answer)
        {
            this.UpdateQuestionToCMS(questionId);
            return this.ValidateAnswerAndUpdateCMS(questionId, answer);
        }

        private DynamicNode GetQuestionFromRandomSelection(int nodeId)
        {
            var member = umbraco.cms.businesslogic.member.Member.GetMemberFromEmail("test@test.com");
            var questionsAnswered = member.getProperty("questionsAppeared").Value;
            var questionsList = questionsAnswered.ToString().Split(',').ToList();
            var node = new DynamicNode(nodeId);
            var result = node.Descendants().Where(item => !questionsList.Contains(item.Id.ToString())).ToList();
            return result.Any() ? result.GetRandom(1).First() : null;
        }

        private void UpdateQuestionToCMS(int questionId)
        {
            var member = umbraco.cms.businesslogic.member.Member.GetMemberFromEmail("test@test.com");
            var questionsAnswered = member.getProperty("questionsAppeared").Value;
            member.getProperty("questionsAppeared").Value = questionsAnswered + "," + questionId;
            member.Save();
        }

        private bool ValidateAnswerAndUpdateCMS(int questionId, string answer)
        {
            var questionNode = new DynamicNode(questionId);
            if (questionNode.GetPropertyValue("answer") == questionNode.GetPropertyValue(answer))
            {
                var member = umbraco.cms.businesslogic.member.Member.GetMemberFromEmail("test@test.com");
                var valueCMS = member.getProperty("puntuation").Value.ToString();
                var puntuation = !string.IsNullOrEmpty(valueCMS) ? Int32.Parse(member.getProperty("puntuation").Value.ToString()) : 0;
                member.getProperty("puntuation").Value = puntuation + 1;
                member.Save();
                return true;
            }
            else
            {
                //error
                return false;
            }
        }
    }
}
