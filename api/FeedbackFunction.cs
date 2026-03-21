using System.Text.Json;
using Azure.Data.Tables;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using SwagathFeedback.Api.Models;

namespace SwagathFeedback.Api;

public class FeedbackFunction
{
    private const string TableName = "feedback";
    private const string BlobContainerName = "feedback-photos";
    private readonly ILogger<FeedbackFunction> _logger;

    public FeedbackFunction(ILogger<FeedbackFunction> logger)
    {
        _logger = logger;
    }

    private static string GetConnectionString()
    {
        return Environment.GetEnvironmentVariable("AzureWebJobsStorage")
            ?? "UseDevelopmentStorage=true";
    }

    private static async Task<TableClient> GetTableClient()
    {
        var client = new TableClient(GetConnectionString(), TableName);
        await client.CreateIfNotExistsAsync();
        return client;
    }

    private static async Task<BlobContainerClient> GetBlobContainerClient()
    {
        var client = new BlobContainerClient(GetConnectionString(), BlobContainerName);
        await client.CreateIfNotExistsAsync(PublicAccessType.Blob);
        return client;
    }

    [Function("GetFeedback")]
    public async Task<IActionResult> GetFeedback(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "feedback")] HttpRequest req)
    {
        _logger.LogInformation("Getting feedback list");

        var tableClient = await GetTableClient();

        var startDateStr = req.Query["startDate"].FirstOrDefault();
        var endDateStr = req.Query["endDate"].FirstOrDefault();

        DateTime? startDate = DateTime.TryParse(startDateStr, out var sd) ? sd : null;
        DateTime? endDate = DateTime.TryParse(endDateStr, out var ed) ? ed : null;

        var entities = new List<FeedbackEntity>();
        await foreach (var entity in tableClient.QueryAsync<FeedbackEntity>(e => e.PartitionKey == "feedback"))
        {
            if (startDate.HasValue && entity.FeedbackTimestamp < startDate.Value)
                continue;
            if (endDate.HasValue && entity.FeedbackTimestamp >= endDate.Value.Date.AddDays(1))
                continue;
            entities.Add(entity);
        }

        var results = entities
            .OrderByDescending(e => e.FeedbackTimestamp)
            .Select(e => new
            {
                id = e.RowKey,
                category = e.Category,
                subcategory = e.Subcategory,
                productName = e.ProductName,
                comment = e.Comment,
                timestamp = e.FeedbackTimestamp.ToString("o"),
                photos = DeserializePhotos(e.PhotosJson)
            });

        return new OkObjectResult(results);
    }

    [Function("CreateFeedback")]
    public async Task<IActionResult> CreateFeedback(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "feedback")] HttpRequest req)
    {
        _logger.LogInformation("Creating feedback");

        var form = await req.ReadFormAsync();

        var category = form["category"].FirstOrDefault();
        var subcategory = form["subcategory"].FirstOrDefault();
        var productName = form["productName"].FirstOrDefault();
        var comment = form["comment"].FirstOrDefault();

        if (string.IsNullOrWhiteSpace(category) || string.IsNullOrWhiteSpace(subcategory) ||
            string.IsNullOrWhiteSpace(productName) || string.IsNullOrWhiteSpace(comment))
        {
            return new BadRequestObjectResult(new { error = "All fields are required." });
        }

        if (comment.Length > 500)
            return new BadRequestObjectResult(new { error = "Comment must be 500 characters or less." });

        var entity = new FeedbackEntity
        {
            Category = category,
            Subcategory = subcategory,
            ProductName = productName,
            Comment = comment,
            FeedbackTimestamp = DateTime.UtcNow
        };

        // Handle photo uploads
        var photos = new List<object>();
        var photoFiles = form.Files.GetFiles("photos");

        if (photoFiles.Any())
        {
            if (photoFiles.Count() > 5)
                return new BadRequestObjectResult(new { error = "Maximum 5 photos allowed." });

            var blobContainer = await GetBlobContainerClient();

            foreach (var file in photoFiles)
            {
                if (!file.ContentType.StartsWith("image/"))
                    continue;

                if (file.Length > 5 * 1024 * 1024)
                    return new BadRequestObjectResult(new { error = "Each photo must be under 5MB." });

                var blobName = $"{entity.RowKey}/{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                var blobClient = blobContainer.GetBlobClient(blobName);

                using var stream = file.OpenReadStream();
                await blobClient.UploadAsync(stream, new BlobHttpHeaders { ContentType = file.ContentType });

                photos.Add(new
                {
                    id = blobName,
                    fileName = file.FileName,
                    url = blobClient.Uri.ToString()
                });
            }
        }

        entity.PhotosJson = JsonSerializer.Serialize(photos);

        var tableClient = await GetTableClient();
        await tableClient.AddEntityAsync(entity);

        return new OkObjectResult(new
        {
            id = entity.RowKey,
            category = entity.Category,
            subcategory = entity.Subcategory,
            productName = entity.ProductName,
            comment = entity.Comment,
            timestamp = entity.FeedbackTimestamp.ToString("o"),
            photos
        });
    }

    [Function("DeleteFeedback")]
    public async Task<IActionResult> DeleteFeedback(
        [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "feedback/{id}")] HttpRequest req,
        string id)
    {
        _logger.LogInformation("Deleting feedback {Id}", id);

        var tableClient = await GetTableClient();

        try
        {
            var entity = await tableClient.GetEntityAsync<FeedbackEntity>("feedback", id);

            // Delete associated photos from Blob Storage
            var photos = DeserializePhotos(entity.Value.PhotosJson);
            if (photos.Any())
            {
                var blobContainer = await GetBlobContainerClient();
                foreach (var photo in photos)
                {
                    if (photo.TryGetValue("id", out var blobName) && blobName != null)
                    {
                        var blobClient = blobContainer.GetBlobClient(blobName.ToString()!);
                        await blobClient.DeleteIfExistsAsync();
                    }
                }
            }

            await tableClient.DeleteEntityAsync("feedback", id);
            return new OkObjectResult(new { message = "Feedback deleted." });
        }
        catch (Azure.RequestFailedException ex) when (ex.Status == 404)
        {
            return new NotFoundObjectResult(new { error = "Feedback not found." });
        }
    }

    [Function("ExportFeedback")]
    public async Task<IActionResult> ExportFeedback(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "feedback/export")] HttpRequest req)
    {
        _logger.LogInformation("Exporting feedback to Excel");

        var tableClient = await GetTableClient();

        var startDateStr = req.Query["startDate"].FirstOrDefault();
        var endDateStr = req.Query["endDate"].FirstOrDefault();

        DateTime? startDate = DateTime.TryParse(startDateStr, out var sd) ? sd : null;
        DateTime? endDate = DateTime.TryParse(endDateStr, out var ed) ? ed : null;

        var entities = new List<FeedbackEntity>();
        await foreach (var entity in tableClient.QueryAsync<FeedbackEntity>(e => e.PartitionKey == "feedback"))
        {
            if (startDate.HasValue && entity.FeedbackTimestamp < startDate.Value)
                continue;
            if (endDate.HasValue && entity.FeedbackTimestamp >= endDate.Value.Date.AddDays(1))
                continue;
            entities.Add(entity);
        }

        entities = entities.OrderByDescending(e => e.FeedbackTimestamp).ToList();

        using var workbook = new XLWorkbook();
        var sheet = workbook.Worksheets.Add("Feedback");

        // Saffron-colored header
        var headerColor = XLColor.FromHtml("#FF9933");
        var headers = new[] { "ID", "Category", "Subcategory", "Product Name", "Comment", "Date" };
        for (int i = 0; i < headers.Length; i++)
        {
            var cell = sheet.Cell(1, i + 1);
            cell.Value = headers[i];
            cell.Style.Fill.BackgroundColor = headerColor;
            cell.Style.Font.Bold = true;
            cell.Style.Font.FontColor = XLColor.White;
        }

        for (int i = 0; i < entities.Count; i++)
        {
            var e = entities[i];
            sheet.Cell(i + 2, 1).Value = e.RowKey;
            sheet.Cell(i + 2, 2).Value = e.Category;
            sheet.Cell(i + 2, 3).Value = e.Subcategory;
            sheet.Cell(i + 2, 4).Value = e.ProductName;
            sheet.Cell(i + 2, 5).Value = e.Comment;
            sheet.Cell(i + 2, 6).Value = e.FeedbackTimestamp.ToString("yyyy-MM-dd HH:mm");
        }

        sheet.Columns().AdjustToContents();

        using var ms = new MemoryStream();
        workbook.SaveAs(ms);
        ms.Position = 0;

        return new FileContentResult(ms.ToArray(),
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        {
            FileDownloadName = $"SwagathFeedback_{DateTime.UtcNow:yyyyMMdd}.xlsx"
        };
    }

    private static List<Dictionary<string, object?>> DeserializePhotos(string? photosJson)
    {
        if (string.IsNullOrEmpty(photosJson) || photosJson == "[]")
            return new List<Dictionary<string, object?>>();

        try
        {
            return JsonSerializer.Deserialize<List<Dictionary<string, object?>>>(photosJson)
                ?? new List<Dictionary<string, object?>>();
        }
        catch
        {
            return new List<Dictionary<string, object?>>();
        }
    }
}
