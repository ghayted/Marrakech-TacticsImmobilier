using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;

namespace backend.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public Task SendEmailAsync(string toEmail, string subject, string body)
    {
        var smtpHost = _configuration["Smtp:Host"] ?? "smtp.gmail.com";
        var smtpPort = int.TryParse(_configuration["Smtp:Port"], out var p) ? p : 587;
        var smtpUser = _configuration["Smtp:User"];
        var smtpPass = _configuration["Smtp:Pass"];
        var fromEmail = _configuration["Smtp:From"] ?? smtpUser;

        if (string.IsNullOrWhiteSpace(smtpUser) || string.IsNullOrWhiteSpace(smtpPass))
        {
            return Task.CompletedTask; // Pas configuré → pas d'envoi en dev
        }

        var mail = new MailMessage();
        mail.From = new MailAddress(fromEmail!);
        mail.To.Add(toEmail);
        mail.Subject = subject;
        mail.Body = body;

        var smtp = new SmtpClient(smtpHost, smtpPort)
        {
            Credentials = new NetworkCredential(smtpUser, smtpPass),
            EnableSsl = true
        };

        return smtp.SendMailAsync(mail);
    }
}


