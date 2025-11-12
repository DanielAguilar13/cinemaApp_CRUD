using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

public class Movie
{
    public int Id { get; set; }

    [Required, MaxLength(100)]
    public required string Name { get; set; }

    [MaxLength(50)]
    public string? Gender { get; set; }

    [Column(TypeName = "time")]
    public TimeSpan? Duration { get; set; }

    // FK
    public int? DirectorId { get; set; }
    public Director? Director { get; set; }
}
