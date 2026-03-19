using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace SwagathFeedback.Functions
{
    public static class SendNotification
    {
        [FunctionName("SendNotification")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "send-notification")] HttpRequestData req,
            ILogger log)
        {
            log.LogInformation("Email notification function triggered");

            try
            {
                string requestBody = await req.ReadAsStringAsync();
                dynamic data = JsonConvert.DeserializeObject(requestBody);

                string email = data?.email;
                dynamic feedback = data?.feedback;

                if (string.IsNullOrEmpty(email))
                {
                    return new BadRequestObjectResult(new { message = "Email address is required" });
                }

                // Build email content
                string emailContent = BuildEmailContent(feedback);

                // TODO: Integrate with SendGrid or Azure Communication Services
                // For now, just log the email
                log.LogInformation($"Email would be sent to: {email}");
                log.LogInformation($"Email content: {emailContent}");

                // Example: Using SendGrid (uncomment when configured)
                // await SendEmailViaSendGrid(email, emailContent, log);

                return new OkObjectResult(new { message = "Notification processed successfully" });
            }
            catch (Exception ex)
            {
                log.LogError($"Error in SendNotification: {ex.Message}");
                return new BadRequestObjectResult(new { message = ex.Message });
            }
        }

        private static string BuildEmailContent(dynamic feedback)
        {
            return $@"
                <h2>New Customer Feedback Received</h2>
                <p><strong>Product:</strong> {feedback.productName}</p>
                <p><strong>Category:</strong> {feedback.category} - {feedback.subcategory}</p>
                <p><strong>Feedback:</strong></p>
                <p>{feedback.comment}</p>
                <p><strong>Submitted on:</strong> {DateTime.Now:g}</p>
                <p>Log in to your admin dashboard to view more details.</p>
            ";
        }

        // Example method for SendGrid integration (requires SendGrid bindings)
        // private static async Task SendEmailViaSendGrid(string recipientEmail, string content, ILogger log)
        // {
        //     // Implementation would go here
        // }
    }
}
