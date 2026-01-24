using Isopoh.Cryptography.Argon2;
using JewelerySolution.Data;
using JewelerySolution.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;



namespace JewelerySolution.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly JeweleryDbContext _context;
        private static string _tempCode;
        private readonly IConfiguration _config;

        public AuthController(JeweleryDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [HttpPost("signup")]
        public async Task<IActionResult> Signup([FromBody] User model)
        {
            if (model == null) return BadRequest("Data is empty.");

            var userExists = await _context.Users.AnyAsync(u => u.Email == model.Email);
            if (userExists) return BadRequest("This email is already registered.");

            string hash = Argon2.Hash(model.PasswordHash);

            model.Role = "User"; // default role
            model.PasswordHash = hash;

            _context.Users.Add(model);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Registration successful!" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginModel)
        {
            if (loginModel == null) return BadRequest("Të dhënat janë bosh.");

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginModel.Email);
            if (user == null) return Unauthorized(new { message = "Email ose fjalëkalim i pasaktë." });

            bool valid = Argon2.Verify(user.PasswordHash, loginModel.PasswordHash);
            if (!valid) return Unauthorized(new { message = "Fjalëkalimi i pasaktë." });

            // generate JWT
            var token = GenerateJwtToken(user);
            Console.WriteLine($"--- JWT Token for {user.Email}: {token} ---");

            Response.Cookies.Append("access_token", token, new CookieOptions
            {
                HttpOnly = false,   // JS can read it, dev only
                Secure = false,     // allow HTTP for localhost
                // HttpOnly = true, // prod only
                // Secure = true, // prod only
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddHours(1)
            });


            return Ok(new
            {
                message = "Login successful!",
                token,
                firstName = user.FirstName,
                role = user.Role ?? "User"
            });
        }

        private string GenerateJwtToken(User user)
        {
            var jwtKey = _config["Jwt:Key"];
            var jwtIssuer = _config["Jwt:Issuer"];

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim("id", user.Id.ToString()),
                new Claim(ClaimTypes.Role, user.Role ?? "User"),
                new Claim("role", user.Role ?? "User"),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: jwtIssuer,
                audience: jwtIssuer,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
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

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            // Delete JWT cookie
            Response.Cookies.Delete("access_token", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict
            });

            return Redirect("/login.html"); 
        }

        [HttpGet("me")]
        public IActionResult Me()
        {
            var token = Request.Cookies["access_token"];
            if (string.IsNullOrEmpty(token))
                return Unauthorized();

            var handler = new JwtSecurityTokenHandler();
            var jwt = handler.ReadJwtToken(token);

            var email = jwt.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Sub)?.Value;
            var role = jwt.Claims.FirstOrDefault(c => c.Type == "role")?.Value
                       ?? jwt.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;

            return Ok(new
            {
                email,
                role,
                isAuthenticated = true
            });
        }

    }
    public class LoginRequest
    {
        public string Email { get; set; }
        public string PasswordHash { get; set; }
    }
}