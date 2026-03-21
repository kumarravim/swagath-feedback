using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace SwagathFeedback.Api;

public class SendNotification
{
    private readonly ILogger<SendNotification> _logger;

    public SendNotification(ILogger<SendNotification> logger)
    {
        _logger = logger;
    }

    [Function("SendNotification")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = "send-notification")] HttpRequest req)
    {
        _logger.LogInformation("Email notification function triggered");

        try
        {
            var body = await new StreamReader(req.Body).ReadToEndAsync();
            using var doc = JsonDocument.Parse(body);
            var root = doc.RootElement;

            var email = root.TryGetProperty("email", out var emailProp) ? emailProp.GetString() : null;

            if (string.IsNullOrEmpty(email))
            {
                return new BadRequestObjectResult(new { message = "Email address is required" });
            }

            var productName = root.TryGetProperty("feedback", out var fb) &&
                              fb.TryGetProperty("productName", out var pn) ? pn.GetString() : "N/A";
            var category = fb.TryGetProperty("category", out var cat) ? cat.GetString() : "N/A";
            var subcategory = fb.TryGetProperty("subcategory", out var sub) ? sub.GetString() : "N/A";
            var comment = fb.TryGetProperty("comment", out var com) ? com.GetString() : "N/A";

            _logger.LogInformation("Email would be sent to: {Email}", email);
            _logger.LogInformation("Product: {Product}, Category: {Category}", productName, category);

            return new OkObjectResult(new { message = "Notification processed successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in SendNotification");
            return new BadRequestObjectResult(new { message = ex.Message });
        }
    }
}
