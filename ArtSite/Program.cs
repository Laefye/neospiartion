using ArtSite.Controllers;
using ArtSite.Database;
using ArtSite.Database.Repositories;
using ArtSite.Services;
using ArtSite.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// Configure the database context
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddScoped<IArtistRepository, ArtistRepository>();
builder.Services.AddScoped<IArtRepository, ArtRepository>();
builder.Services.AddScoped<IPictureRepository, PictureRepository>();


// Add controllers to the container.
builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<ExceptionHandler>();
builder.Services.AddControllers();

// Add services to the container.
builder.Services.AddScoped<IArtistService, ArtistService>();
builder.Services.AddHttpClient<VKService>();
builder.Services.AddScoped<IVKService, VKService>(VKService.CreateFactory(builder.Configuration));
builder.Services.AddScoped<IImportService, ImportService>();

// Add Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();