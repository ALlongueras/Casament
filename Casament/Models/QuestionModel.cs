using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Casament.Models
{
    public class QuestionModel
    {
        public string Title { get; set; }
        public string Question { get; set; }
        public List<string> Answers { get; set; } 
        public int QuestionId { get; set; }
    }
}