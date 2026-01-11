using JewelerySolution.Data;
using Microsoft.EntityFrameworkCore;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllersWithViews()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    });

// Add CORS support
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Add Session support
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

// ?? DbContext DUHET ktu (PARA Build)
builder.Services.AddDbContext<JeweleryDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

var app = builder.Build();

// Configure the HTTP request pipeline
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseCors(); // Enable CORS

app.UseSession(); // Enable session middleware

app.UseAuthorization();

app.MapControllers(); // Map API controllers
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();

/*
// Pjesa e Seeding
try
{
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        var context = services.GetRequiredService<JeweleryDbContext>();

        // Ky rresht siguron q databaza ekziston para se t tentoj seeding
        context.Database.EnsureCreated();

        DbSeeder.SeedAdminUser(context).GetAwaiter().GetResult();
    }
}
catch (Exception ex)
{
    // Kjo do t printoj gabimin n dritaren e zez pa e mbyllur serverin
    Console.WriteLine(">>> DATABASE ERROR: " + ex.Message);
}

app.Run();  
*/
