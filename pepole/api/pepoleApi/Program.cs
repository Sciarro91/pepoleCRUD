using Microsoft.EntityFrameworkCore;


var  MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      builder  =>
                      {
                          builder.WithOrigins("http://localhost:4200")
                          .AllowAnyMethod()
                          .AllowAnyHeader();
                      });
});


builder.Services.AddDbContext<PepoleDb>(opt => opt.UseInMemoryDatabase("PersonList"));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();
var app = builder.Build();


app.MapGet("/pepoleList", async (PepoleDb db) =>
    await db.Pepole.ToListAsync());


app.MapPost("/pepoleList/", async (Person person, PepoleDb db) =>
{
    db.Pepole.Add(person);
    await db.SaveChangesAsync();

    return Results.Created($"/pepoleList/{person.Id}", person);
});

app.MapPut("/pepoleList/{id}", async (int id, Person inputPerson, PepoleDb db) =>
{
    var person = await db.Pepole.FindAsync(id);

    if (person is null) return Results.NotFound();

    person.nome = inputPerson.nome;
    person.cognome = inputPerson.cognome;
    person.luogo_nascita = inputPerson.luogo_nascita;
    person.codice_fiscale = inputPerson.codice_fiscale;
    person.data_nascita = inputPerson.data_nascita;
    person.provincia = inputPerson.provincia;
    person.sesso = inputPerson.sesso;

    await db.SaveChangesAsync();

    return Results.NoContent();
});

app.MapDelete("/pepoleList/{id}", async (int id, PepoleDb db) =>
{
    if (await db.Pepole.FindAsync(id) is Person person)
    {
        db.Pepole.Remove(person);
        await db.SaveChangesAsync();
        return Results.Ok(person);
    }

    return Results.NotFound();
});

app.MapGet("/luoghiNascita/",  (string src) =>{

     
   string csv_file_path = @".\Elenco-comuni-italiani.csv";
   
   var parser = new Microsoft.VisualBasic.FileIO.TextFieldParser(csv_file_path);
   parser.TextFieldType = Microsoft.VisualBasic.FileIO.FieldType.Delimited;
   parser.SetDelimiters(new string[] { ";" });

    string[] row;
    List<string> res = new List<string>();  
   while (!parser.EndOfData)
    {
        row = parser.ReadFields();
        res.Add(row[6]);
    }

    var r = res.Where(item => item.ToUpperInvariant().Contains(src.ToUpperInvariant()));

    return Results.Ok( r );
    
});




app.UseCors(MyAllowSpecificOrigins);

app.Run();

class Person
{
    public int Id { get; set; }
    public string? nome { get; set; }
    public string? cognome { get; set; }

    public string? codice_fiscale { get; set; }

    public string? data_nascita { get; set; }
    public string? luogo_nascita { get; set; }

    public string? provincia { get; set; }

    public string? sesso { get; set; }

}

class PepoleDb : DbContext
{
    public PepoleDb(DbContextOptions<PepoleDb> options)
        : base(options) { }

    public DbSet<Person> Pepole => Set<Person>();
}