using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Movie> Movies => Set<Movie>();
    public DbSet<Director> Directors => Set<Director>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<Director>(e =>
        {
            e.ToTable("Director");
            e.Property(p => p.Name).HasMaxLength(100).IsRequired();
        });

        b.Entity<Movie>(e =>
        {
            e.ToTable("Movies");
            e.Property(p => p.Name).HasMaxLength(100).IsRequired();
            e.Property(p => p.Gender).HasMaxLength(50);
            e.Property(p => p.Duration).HasColumnType("time");
            e.HasOne(p => p.Director)
             .WithMany(d => d.Movies)
             .HasForeignKey(p => p.DirectorId)
             .OnDelete(DeleteBehavior.Restrict);
        });

        // Seed de ejemplo
        b.Entity<Director>().HasData(
            new Director { Id = 1, Name = "Christopher Nolan", Age = 53, Active = true },
            new Director { Id = 2, Name = "Greta Gerwig", Age = 41, Active = true }
        );
        b.Entity<Movie>().HasData(
            new Movie { Id = 1, Name = "Inception", Gender = "Sci-Fi", Duration = new TimeSpan(2, 28, 0), DirectorId = 1 },
            new Movie { Id = 2, Name = "Barbie", Gender = "Comedy", Duration = new TimeSpan(1, 54, 0), DirectorId = 2 }
        );
    }
}
