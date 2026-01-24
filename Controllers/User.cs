using JewelerySolution.Data;
using JewelerySolution.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JewelerySolution.Controllers
{

    public class UserController : Controller
    {
        private readonly JeweleryDbContext _context;
        private readonly IWebHostEnvironment _env;

        public UserController(JeweleryDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        public IActionResult Index()
        {
            var users = _context.Users
                .ToList();

            return View(users);
        }

    }
}
