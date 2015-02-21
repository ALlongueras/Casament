using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Casament.Controllers
{
    using Umbraco.Core;
    using Umbraco.Core.Services;
    using Umbraco.Web.WebApi;

    public class AssistanceController : UmbracoApiController
    {
        [HttpGet]
        public bool UpdateAssistance(int id, int action)
        {
            var currentMember = ApplicationContext.Current.Services.MemberService.GetById(id);
            var assistance = currentMember.Properties.FirstOrDefault(x => x.Alias == "assistance");
            if (assistance != null)
            {
                var newAssistance = action == 1;
                assistance.Value = newAssistance;
                ApplicationContext.Current.Services.MemberService.Save(currentMember);
                return true;
            }
            return false;
        }

        [HttpGet]
        public int GetCurrentAssistance(int id)
        {
            var currentMember = ApplicationContext.Current.Services.MemberService.GetById(id);
            var assistance = currentMember.Properties.FirstOrDefault(x => x.Alias == "assistance");
            if (assistance == null)
            {
                return -1;
            }

            if (assistance.Value == null)
            {
                return -1;
            }

            return int.Parse(assistance.Value.ToString());
        }

    }
}
