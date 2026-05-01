using FB365.Data;
using FB365.Models;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FB365.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FeedbackController : ControllerBase
{
    private readonly FeedbackDbContext _db;
    private readonly IWebHostEnvironment _env;

    public FeedbackController(FeedbackDbContext db, IWebHostEnvironment env)
    {
        _db = db;
        _env = env;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        var query = _db.Feedbacks.Include(f => f.Photos).AsQueryable();

        if (startDate.HasValue)
            query = query.Where(f => f.Timestamp >= startDate.Value);

        if (endDate.HasValue)
        {
            var end = endDate.Value.Date.AddDays(1);
            query = query.Where(f => f.Timestamp < end);
        }

        var results = await query.OrderByDescending(f => f.Timestamp).ToListAsync();

        var response = results.Select(f => new
        {
            f.Id,
            f.Category,
            f.Subcategory,
            f.ProductName,
            f.Comment,
            timestamp = f.Timestamp.ToString("o"),
            photos = f.Photos.Select(p => new
            {
                p.Id,
                p.FileName,
                url = $"/uploads/{p.FilePath}"
            })
        });

        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromForm] string? category, [FromForm] string? subcategory,
        [FromForm] string? productName, [FromForm] string comment, [FromForm] List<IFormFile>? photos)
    {
        if (string.IsNullOrWhiteSpace(comment))
        {
            return BadRequest(new { error = "Comment is required." });
        }

        if (comment.Length > 500)
            return BadRequest(new { error = "Comment must be 500 characters or less." });

        var feedback = new Feedback
        {
            Category = category ?? string.Empty,
            Subcategory = subcategory ?? string.Empty,
            ProductName = productName ?? string.Empty,
            Comment = comment,
            Timestamp = DateTime.UtcNow
        };

        // Handle photo uploads
        if (photos is { Count: > 0 })
        {
            if (photos.Count > 5)
                return BadRequest(new { error = "Maximum 5 photos allowed." });

            var uploadsDir = Path.Combine(_env.ContentRootPath, "uploads");
            Directory.CreateDirectory(uploadsDir);

            foreach (var photo in photos)
            {
                if (!photo.ContentType.StartsWith("image/"))
                    continue;

                // Limit file size to 5MB
                if (photo.Length > 5 * 1024 * 1024)
                    return BadRequest(new { error = "Each photo must be under 5MB." });

                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(photo.FileName)}";
                var filePath = Path.Combine(uploadsDir, fileName);

                using var stream = new FileStream(filePath, FileMode.Create);
                await photo.CopyToAsync(stream);

                feedback.Photos.Add(new FeedbackPhoto
                {
                    FileName = photo.FileName,
                    FilePath = fileName
                });
            }
        }

        _db.Feedbacks.Add(feedback);
        await _db.SaveChangesAsync();

        return Ok(new
        {
            feedback.Id,
            feedback.Category,
            feedback.Subcategory,
            feedback.ProductName,
            feedback.Comment,
            timestamp = feedback.Timestamp.ToString("o"),
            photos = feedback.Photos.Select(p => new
            {
                p.Id,
                p.FileName,
                url = $"/uploads/{p.FilePath}"
            })
        });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var feedback = await _db.Feedbacks.Include(f => f.Photos).FirstOrDefaultAsync(f => f.Id == id);
        if (feedback == null)
            return NotFound(new { error = "Feedback not found." });

        var uploadsDir = Path.Combine(_env.ContentRootPath, "uploads");
        foreach (var photo in feedback.Photos)
        {
            var filePath = Path.Combine(uploadsDir, photo.FilePath);
            if (System.IO.File.Exists(filePath))
                System.IO.File.Delete(filePath);
        }

        _db.Feedbacks.Remove(feedback);
        await _db.SaveChangesAsync();

        return Ok(new { message = "Feedback deleted." });
    }

    [HttpGet("export")]
    public async Task<IActionResult> Export([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        var query = _db.Feedbacks.Include(f => f.Photos).AsQueryable();

        if (startDate.HasValue)
            query = query.Where(f => f.Timestamp >= startDate.Value);

        if (endDate.HasValue)
        {
            var end = endDate.Value.Date.AddDays(1);
            query = query.Where(f => f.Timestamp < end);
        }

        var results = await query.OrderByDescending(f => f.Timestamp).ToListAsync();

        using var workbook = new XLWorkbook();
        var sheet = workbook.Worksheets.Add("Feedback");

        // Header row
        sheet.Cell(1, 1).Value = "ID";
        sheet.Cell(1, 2).Value = "Date";
        sheet.Cell(1, 3).Value = "Category";
        sheet.Cell(1, 4).Value = "Subcategory";
        sheet.Cell(1, 5).Value = "Product Name";
        sheet.Cell(1, 6).Value = "Comment";
        sheet.Cell(1, 7).Value = "Photos Count";

        var headerRange = sheet.Range(1, 1, 1, 7);
        headerRange.Style.Font.Bold = true;
        headerRange.Style.Fill.BackgroundColor = XLColor.FromHtml("#E8701A");
        headerRange.Style.Font.FontColor = XLColor.White;

        // Data rows
        for (int i = 0; i < results.Count; i++)
        {
            var f = results[i];
            var row = i + 2;
            sheet.Cell(row, 1).Value = f.Id;
            sheet.Cell(row, 2).Value = f.Timestamp.ToString("yyyy-MM-dd HH:mm");
            sheet.Cell(row, 3).Value = f.Category;
            sheet.Cell(row, 4).Value = f.Subcategory;
            sheet.Cell(row, 5).Value = f.ProductName;
            sheet.Cell(row, 6).Value = f.Comment;
            sheet.Cell(row, 7).Value = f.Photos.Count;
        }

        sheet.Columns().AdjustToContents();

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);
        stream.Position = 0;

        var fileName = $"swagath-feedback-{DateTime.UtcNow:yyyyMMdd-HHmmss}.xlsx";
        return File(stream.ToArray(),
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            fileName);
    }
}
