namespace FB365.Models;

public class Feedback
{
    public int Id { get; set; }
    public string Category { get; set; } = string.Empty;
    public string Subcategory { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public string Comment { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public List<FeedbackPhoto> Photos { get; set; } = new();
}

public class FeedbackPhoto
{
    public int Id { get; set; }
    public int FeedbackId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
}
