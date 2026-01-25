using JewelerySolution.Data;
using JewerlySolution.Data;
using Microsoft.AspNetCore.Mvc;

namespace JewelerySolution.Controllers
{
	public class TestController : Controller
	{
		private readonly AppDbContext _db;

		public TestController(AppDbContext db)
		{
			_db = db;
		}

		public IActionResult Index()
		{
			var products = _db.Products.ToList();
			return Json(products);
		}
	}
}
