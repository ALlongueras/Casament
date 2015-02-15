namespace NewSection.Controllers
{
    using System.Collections.Generic;
    using System.IO;
    using System.Web;
    using System.Web.Http;
    using global::MemberImporter.Business;
    using MemberImporter.Models;
    using Umbraco.Web.WebApi;

    public class MemberImporterController : UmbracoApiController
    {
        [HttpPost]
        public void InsertMember()
        {
            var httpPostedFile = HttpContext.Current.Request.Files["UploadedFile"];
            if (httpPostedFile != null)
            {
                var fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath("~/fileUpload"), httpPostedFile.FileName);

                // Save the uploaded file to "UploadedFiles" folder
                httpPostedFile.SaveAs(fileSavePath);
                var reader = new StreamReader(File.OpenRead(fileSavePath));
                var listA = new List<CsvFileModel>();
                while (!reader.EndOfStream)
                {
                    var line = reader.ReadLine();
                    var values = line.Split(';');

                    listA.Add(new CsvFileModel
                                  {
                                      Name = values[0],
                                      Login = values[1],
                                      Email = values[2],
                                      Password = values[3]
                                  });
                }

                var memberImporterBusiness = new MemberImporterBusiness();
                foreach (var lines in listA)
                {
                    memberImporterBusiness.InsertMembers(lines.Name, lines.Login, lines.Email, lines.Password);
                    
                }
                
            }
        }
    }
}