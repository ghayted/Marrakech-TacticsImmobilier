using Microsoft.AspNetCore.Mvc;
using System.Net.Mail;
using System.Net;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        [HttpPost]
        public IActionResult SendContact([FromBody] ContactFormModel model)
        {
            try
            {
                var mail = new MailMessage();
                mail.From = new MailAddress(model.Email);
                mail.To.Add("dafalighayt@gmail.com");
                mail.Subject = $"Nouveau message de {model.Prenom} {model.Nom} via le site";
                mail.Body = $"Nom: {model.Nom}\nPrénom: {model.Prenom}\nEmail: {model.Email}\nTéléphone: {model.Tel}\n\nMessage:\n{model.Message}";

                // Utilise le SMTP Gmail
                var smtp = new SmtpClient("smtp.gmail.com", 587)
                {
                    Credentials = new NetworkCredential("dafalighayt@gmail.com", "jipt whjn nuvx nzxn"),
                    EnableSsl = true
                };

                smtp.Send(mail);

                return Ok(new { success = true, message = "Message envoyé !" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Erreur lors de l'envoi", error = ex.Message });
            }
        }
    }

    public class ContactFormModel
    {
        public string Nom { get; set; }
        public string Prenom { get; set; }
        public string Email { get; set; }
        public string Tel { get; set; }
        public string Message { get; set; }
    }
} 