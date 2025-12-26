using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using JewelerySolution.Data;
using JewelerySolution.Models;
using System.Text.Json;

namespace JewelerySolution.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly JeweleryDbContext _context;
        private static string _tempCode;

        public AuthController(JeweleryDbContext context)
        {
            _context = context;
        }

        [HttpPost("signup")]
        public async Task<IActionResult> Signup([FromBody] User model)
        {
            if (model == null) return BadRequest("Data is empty.");
            var userExists = await _context.Users.AnyAsync(u => u.Email == model.Email);
            if (userExists) return BadRequest("This email is already registered.");

            _context.Users.Add(model);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Registration successful!" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User loginModel)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == loginModel.Email && u.PasswordHash == loginModel.PasswordHash);

            if (user == null)
            {
                return Unauthorized(new { message = "Invalid email or password." });
            }

            return Ok(new
            {
                message = "Login successful!",
                firstName = user.FirstName,
                userId = user.Id
            });
        }

        [HttpPost("send-code")]
        public IActionResult SendCode([FromBody] User model)
        {
            var userExists = _context.Users.Any(u => u.Email == model.Email);
            if (!userExists) return NotFound("Email does not exist.");

            _tempCode = new Random().Next(100000, 999999).ToString();
            Console.WriteLine($"--- RESET CODE: {_tempCode} ---");

            return Ok(new { message = "Code sent successfully." });
        }

        [HttpPost("verify-code")]
        public IActionResult VerifyCode([FromBody] JsonElement data)
        {
            if (data.TryGetProperty("code", out JsonElement codeElement))
            {
                string code = codeElement.GetString();
                if (code == _tempCode) return Ok();
            }
            return BadRequest("Invalid verification code.");
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] User model)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);
            if (user == null) return NotFound("User not found.");

            user.PasswordHash = model.PasswordHash;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Password updated successfully!" });
        }
    }
}