using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Casament.Controllers
{
    using System.Configuration;
    using System.Net.Mail;
    using System.Reflection;
    using System.Text;

    using Casament.Models;

    using Umbraco.Core.Logging;
    using Umbraco.Web.WebApi;

    public class ContactFormController : UmbracoApiController
    {
        [HttpGet]
        public void GetConsultForm(string consulta, string email)
        {
            if (ModelState.IsValid)
            {
                Dictionary<string, string> dataConf = this.GetDataSendMail();
                if (dataConf.Count() > 0)
                {
                    int port = Int16.Parse(dataConf["port"]);
                    string host = dataConf["host"];
                    string to = dataConf["mailTo"];
                    string pass = dataConf["passTo"];

                    var sb = new StringBuilder();
                    sb.AppendFormat("<p>Message: {0}</p>", consulta);
                    sb.AppendFormat("<p>Email from website: {0}</p>", email);

                    SmtpClient smtp = new SmtpClient(host, port) { EnableSsl = true };
                    NetworkCredential credentials = new NetworkCredential(to, pass);

                    MailMessage message = new MailMessage();

                    message.From = new MailAddress(email);
                    message.To.Add(new MailAddress(to));
                    message.Subject = "Consulta " + email;
                    message.Body = sb.ToString();
                    message.IsBodyHtml = true;

                    try
                    {
                        smtp.EnableSsl = true;
                        smtp.Credentials = credentials;
                        smtp.Send(message);
                    }
                    catch (SmtpException smtpEx)
                    {

                    }
                }
            }
        }

        private Dictionary<string, string> GetDataSendMail()
        {
            Dictionary<string, string> dataConf = new Dictionary<string, string>();

            String mailTo = ConfigurationManager.AppSettings["sendMail:mail"];
            String passTo = ConfigurationManager.AppSettings["sendMail:password"];
            String host = ConfigurationManager.AppSettings["sendMail:host"];
            String port = ConfigurationManager.AppSettings["sendMail:port"];

            LogHelper.Info(MethodBase.GetCurrentMethod().DeclaringType, string.Format("SMTP configuration: {0}-{1}", host, port));

            if (!string.IsNullOrEmpty(mailTo) && !string.IsNullOrEmpty(passTo) && !string.IsNullOrEmpty(host) && !string.IsNullOrEmpty(port))
            {
                dataConf["mailTo"] = mailTo;
                dataConf["passTo"] = passTo;
                dataConf["host"] = host;
                dataConf["port"] = port;
            }

            return dataConf;
        }
    }
}
