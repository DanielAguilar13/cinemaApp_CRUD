using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);


var connectionString =
    builder.Configuration.GetConnectionString("DefaultConnection") ??
    Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection");

if (string.IsNullOrWhiteSpace(connectionString))
    throw new InvalidOperationException("No hay cadena de conexión 'DefaultConnection'.");

builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlServer(connectionString, sql => sql.EnableRetryOnFailure()));


builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.ConfigureHttpJsonOptions(o =>
{
    o.SerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

var app = builder.Build();

app.UseCors();
app.UseSwagger();
app.UseSwaggerUI();

// Crear DB si no existe (dev/demo)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.EnsureCreatedAsync();
}

app.MapGet("/", () => Results.Redirect("/swagger"));

// ======= GROUP: Directors =======
var directors = app.MapGroup("/api/directors").WithTags("Directors");

// GET /api/directors
directors.MapGet("", async (AppDbContext db) =>
{
    var list = await db.Directors.AsNoTracking().OrderBy(d => d.Name).ToListAsync();
    return TypedResults.Ok(list);
});

// GET /api/directors/{id}
directors.MapGet("/{id:int}", async Task<Results<Ok<Director>, NotFound>> (int id, AppDbContext db) =>
{
    var d = await db.Directors.Include(x => x.Movies).FirstOrDefaultAsync(x => x.Id == id);
    return d is null ? TypedResults.NotFound() : TypedResults.Ok(d);
});

// POST /api/directors
directors.MapPost("", async Task<Created<Director>> (Director dto, AppDbContext db) =>
{
    db.Directors.Add(dto);
    await db.SaveChangesAsync();
    return TypedResults.Created($"/api/directors/{dto.Id}", dto);
});

// PUT /api/directors/{id}
directors.MapPut("/{id:int}", async Task<Results<NoContent, BadRequest, NotFound>> (int id, Director dto, AppDbContext db) =>
{
    if (id != dto.Id) return TypedResults.BadRequest();
    if (!await db.Directors.AnyAsync(x => x.Id == id)) return TypedResults.NotFound();

    db.Entry(dto).State = EntityState.Modified;
    await db.SaveChangesAsync();
    return TypedResults.NoContent();
});

// DELETE /api/directors/{id}
directors.MapDelete("/{id:int}", async Task<Results<NoContent, NotFound>> (int id, AppDbContext db) =>
{
    var d = await db.Directors.FindAsync(id);
    if (d is null) return TypedResults.NotFound();

    db.Directors.Remove(d);
    await db.SaveChangesAsync();
    return TypedResults.NoContent();
});

// ======= GROUP: Movies =======
var movies = app.MapGroup("/api/movies").WithTags("Movies");

// GET /api/movies
movies.MapGet("", async (AppDbContext db) =>
{
    var list = await db.Movies.AsNoTracking()
                              .Include(m => m.Director)
                              .OrderBy(m => m.Name)
                              .ToListAsync();
    return TypedResults.Ok(list);
});

// GET /api/movies/{id}
movies.MapGet("/{id:int}", async Task<Results<Ok<Movie>, NotFound>> (int id, AppDbContext db) =>
{
    var m = await db.Movies.Include(x => x.Director).FirstOrDefaultAsync(x => x.Id == id);
    return m is null ? TypedResults.NotFound() : TypedResults.Ok(m);
});

// POST /api/movies
movies.MapPost("", async Task<Results<Created<Movie>, BadRequest<string>>> (Movie dto, AppDbContext db) =>
{
    var directorExists = await db.Directors.AnyAsync(d => d.Id == dto.DirectorId);
    if (!directorExists)
        return TypedResults.BadRequest("DirectorId inválido");

    db.Movies.Add(dto);
    await db.SaveChangesAsync();
    return TypedResults.Created($"/api/movies/{dto.Id}", dto);
});

// PUT /api/movies/{id}
movies.MapPut("/{id:int}", async Task<Results<NoContent, BadRequest<string>, NotFound>> (int id, Movie dto, AppDbContext db) =>
{
    if (id != dto.Id)
        return TypedResults.BadRequest("El id de la ruta no coincide con el cuerpo.");

    var exists = await db.Movies.AnyAsync(m => m.Id == id);
    if (!exists) return TypedResults.NotFound();

    var directorExists = await db.Directors.AnyAsync(d => d.Id == dto.DirectorId);
    if (!directorExists)
        return TypedResults.BadRequest("DirectorId inválido");

    db.Entry(dto).State = EntityState.Modified;
    await db.SaveChangesAsync();
    return TypedResults.NoContent();
});

// DELETE /api/movies/{id}
movies.MapDelete("/{id:int}", async Task<Results<NoContent, NotFound>> (int id, AppDbContext db) =>
{
    var m = await db.Movies.FindAsync(id);
    if (m is null) return TypedResults.NotFound();

    db.Movies.Remove(m);
    await db.SaveChangesAsync();
    return TypedResults.NoContent();
});


app.Run();
