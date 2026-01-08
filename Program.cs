using Microsoft.EntityFrameworkCore;
using JewelerySolution.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllersWithViews();

// ?? DbContext DUHET këtu (PARA Build)
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

app.UseAuthorization();

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

        // Ky rresht siguron që databaza ekziston para se të tentojë seeding
        context.Database.EnsureCreated();

        DbSeeder.SeedAdminUser(context).GetAwaiter().GetResult();
    }
}
catch (Exception ex)
{
    // Kjo do të printojë gabimin në dritaren e zezë pa e mbyllur serverin
    Console.WriteLine(">>> DATABASE ERROR: " + ex.Message);
}

app.Run();  
*/
