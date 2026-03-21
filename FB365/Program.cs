using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using FB365.Data;

var builder = WebApplication.CreateBuilder(args);

// Configure SQLite
var dbPath = Path.Combine(builder.Environment.ContentRootPath, "..", "feedback.db");
builder.Services.AddDbContext<FeedbackDbContext>(options =>
    options.UseSqlite($"Data Source={Path.GetFullPath(dbPath)}"));

builder.Services.AddControllers();

var app = builder.Build();

// Auto-create database
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<FeedbackDbContext>();
    db.Database.EnsureCreated();
}

// Serve the static SPA from wwwroot_static folder
var staticPath = Path.Combine(app.Environment.ContentRootPath, "..", "wwwroot_static");
var fileProvider = new PhysicalFileProvider(Path.GetFullPath(staticPath));

app.UseDefaultFiles(new DefaultFilesOptions { FileProvider = fileProvider });
app.UseStaticFiles(new StaticFileOptions { FileProvider = fileProvider });

// Serve uploaded photos
var uploadsPath = Path.Combine(app.Environment.ContentRootPath, "..", "uploads");
Directory.CreateDirectory(uploadsPath);
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.GetFullPath(uploadsPath)),
    RequestPath = "/uploads"
});

app.MapControllers();

app.Run();
