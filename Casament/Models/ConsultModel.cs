using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Casament.Models
{
    using System.ComponentModel.DataAnnotations;

    public class ConsultModel
    {
        [Required]
        public string Subject { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public string Message { get; set; }

        public string Phone { get; set; }

        public string State { get; set; }

        public string TextButton { get; set; }

        public string TextForm { get; set; }

        public string TextEmail { get; set; }
    }
}