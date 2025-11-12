using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class Director
{
    public int Id { get; set; }

    [Required, MaxLength(100)]
    public required string Name { get; set; }

    public int? Age { get; set; }
    public bool Active { get; set; } = true;

    public ICollection<Movie> Movies { get; set; } = new List<Movie>();
}
