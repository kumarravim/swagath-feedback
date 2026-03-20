using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

var app = builder.Build();

// Serve the static SPA from wwwroot_static folder
var staticPath = Path.Combine(app.Environment.ContentRootPath, "..", "wwwroot_static");
var fileProvider = new PhysicalFileProvider(Path.GetFullPath(staticPath));

app.UseDefaultFiles(new DefaultFilesOptions { FileProvider = fileProvider });
app.UseStaticFiles(new StaticFileOptions { FileProvider = fileProvider });

app.Run();
