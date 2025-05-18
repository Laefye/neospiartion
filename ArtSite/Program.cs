using ArtSite.Config;
using ArtSite.Core.Interfaces.Repositories;
using ArtSite.Core.Interfaces.Services;
using ArtSite.Core.Services;
using ArtSite.Database;
using ArtSite.Database.Repositories;
using ArtSite.Services;
using ArtSite.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);


// Configure the database context
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IPictureRepository, PictureRepository>();
builder.Services.AddScoped<IProfileRepository, ProfileRepository>();
builder.Services.AddScoped<IArtRepository, ArtRepository>();
builder.Services.AddScoped<ICommentRepository, CommentRepository>();
builder.Services.AddScoped<ITierRepository, TierRepository>();
builder.Services.AddScoped<ISubscriptionRepository, SubscriptionRepository>();
builder.Services.AddScoped<IStoragedFileRepository, StoragedFileRepository>();
builder.Services.AddScoped<ICommissionRepository, CommissionRepository>();
builder.Services.AddScoped<IMessageRepository, MessageRepository>();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "dev",
                        policy =>
                        {
                            policy.AllowAnyOrigin();
                            policy.AllowAnyMethod();
                            policy.AllowAnyHeader();
                        });
});


// Configure the identity
builder.Services.AddIdentity<IdentityUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();
builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(jwtOptions =>
    {
        var config = new JwtConfig(builder.Configuration);
        jwtOptions.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = config.Issuer,
            ValidAudience = config.Audience,
            IssuerSigningKey = config.SymmetricSecurityKey,
            ClockSkew = TimeSpan.Zero
        };
    });
builder.Services.AddAuthorization();

// Add controllers to the container.
builder.Services.AddProblemDetails();
builder.Services.AddControllers();

// Add services to the container.
builder.Services.AddScoped<IProfileService, ProfileService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IStorageService, StorageService>();
builder.Services.AddScoped<IArtService, ArtService>();
builder.Services.AddScoped<ICommentService, CommentService>();
builder.Services.AddScoped<ITierService, TierService>();
builder.Services.AddScoped<ISubscriptionService, SubscriptionService>();
builder.Services.AddScoped<ICommissionService, CommissionService>();
builder.Services.AddScoped<IMessageService, MessageService>();

builder.Services.AddHttpClient<VKService>();
builder.Services.AddScoped<IVKService, VKService>(VKService.CreateFactory(builder.Configuration));
builder.Services.AddScoped<IImportService, ImportService>();

// Add Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please insert JWT with Bearer into field",
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement {
    {
        new OpenApiSecurityScheme
        {
            Reference = new OpenApiReference
            {
                Type = ReferenceType.SecurityScheme,
                Id = "Bearer"
            }
        },
        new string[] { }
    }
    });
});

var app = builder.Build();

app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors("dev");
}

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();