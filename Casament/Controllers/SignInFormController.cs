using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using Casament.Models;
using umbraco.BusinessLogic;
using umbraco.cms.businesslogic.member;

namespace Casament.Controllers
{
    public class SignInFormController : Umbraco.Web.Mvc.SurfaceController
    {
        //
        // GET: /SignInForm/

        [HttpGet]
        [ActionName("MemberUmbLogin")]
        public ActionResult MemberUmbLoginGet()
        {
            return PartialView("SignInForm", new SignInModel());
        }

        [HttpGet]
        public ActionResult MemberUmbLogout()
        {
            Session.Clear();
            FormsAuthentication.SignOut();
            return Redirect("/");
        }

        [HttpPost]
        [ActionName("MemberUmbLogin")]
        public ActionResult SignIn(SignInModel signInModel)
        {
            string returnUrl = GetValidReturnUrl(Request.UrlReferrer);

            if (!ModelState.IsValid)
            {
                TempData["SignInSuccess"] = false;
                return CurrentUmbracoPage();
            }
            TempData["Email"] = signInModel.Email;
            TempData["Password"] = signInModel.Password;
            if (Membership.ValidateUser(signInModel.Email, signInModel.Password))
            {
                TempData["SignInSuccess"] = true;
                FormsAuthentication.SetAuthCookie(signInModel.Email, signInModel.RememberMe);

                if (Url.IsLocalUrl(returnUrl) && !String.IsNullOrWhiteSpace(returnUrl))
                {
                    return Redirect(returnUrl);
                }

                return RedirectToCurrentUmbracoPage();
            }
            TempData["SignInSuccess"] = false;
            TempData["Status"] = "Invalid username or password";
            return RedirectToCurrentUmbracoPage();
        }

        public ActionResult IsSignedIn()
        {
            if (1!=1)
            {
                return Redirect("/");
            }
            return null;
        }

        private static String GetValidReturnUrl(Uri uri)
        {
            string returnUrl = null;

            if (uri != null && !String.IsNullOrWhiteSpace(uri.PathAndQuery) && uri.PathAndQuery.StartsWith("/") &&
                !uri.PathAndQuery.StartsWith("//") && !uri.PathAndQuery.StartsWith("/\\"))
            {
                returnUrl = uri.PathAndQuery;
            }

            return returnUrl;
        }

        public static string CreateNewUser(string email, string password, bool signInSuccess)
        {
            if (signInSuccess)
            {
                var currentUser = Membership.GetUser(email);
                if (currentUser != null)
                {
                    return "User Exist";
                }
                var memberType = MemberType.GetByAlias("FrontEndUser");
                var user = new User(0);
                var member = Member.MakeNew(email, memberType, user);
                member.LoginName = email;
                member.ChangePassword(password);
                return "User added";
            }
            return "Error";
        }
    }
}