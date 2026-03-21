using Microsoft.EntityFrameworkCore;

namespace FB365.Data;

public class FeedbackDbContext : DbContext
{
    public FeedbackDbContext(DbContextOptions<FeedbackDbContext> options) : base(options) { }

    public DbSet<Models.Feedback> Feedbacks => Set<Models.Feedback>();
    public DbSet<Models.FeedbackPhoto> FeedbackPhotos => Set<Models.FeedbackPhoto>();
}
