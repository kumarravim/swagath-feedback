using Azure;
using Azure.Data.Tables;

namespace SwagathFeedback.Api.Models;

public class FeedbackEntity : ITableEntity
{
    public string PartitionKey { get; set; } = "feedback";
    public string RowKey { get; set; } = Guid.NewGuid().ToString();
    public DateTimeOffset? Timestamp { get; set; }
    public ETag ETag { get; set; }

    public string Category { get; set; } = string.Empty;
    public string Subcategory { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public string Comment { get; set; } = string.Empty;
    public DateTime FeedbackTimestamp { get; set; } = DateTime.UtcNow;
    // JSON array of photo URLs stored in Blob Storage
    public string PhotosJson { get; set; } = "[]";
}
