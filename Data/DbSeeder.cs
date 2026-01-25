using JewelerySolution.Models;
using Microsoft.EntityFrameworkCore;

namespace JewelerySolution.Data
{
    public static class DbSeeder
    {
        public static async Task SeedAdminUser(JeweleryDbContext context)
        {
            // Kontrollojm� n�se ekziston nj� p�rdorues me k�t� email
            var adminEmail = "admin@jewelery.com";
            var adminExists = await context.Users.AnyAsync(u => u.Email == adminEmail);

            if (!adminExists)
            {
                var adminUser = new User
                {
                    FirstName = "Admin",
                    LastName = "System",
                    Email = adminEmail,
                    PasswordHash = "Admin123", // Mund ta ndryshosh si t� duash
                    Role = "Admin" // Ky �sht� hapi kryesor (Pika 19)
                };

                context.Users.Add(adminUser);
                await context.SaveChangesAsync();
                Console.WriteLine("Admin user seeded successfully!");
            }
        }
    }
}