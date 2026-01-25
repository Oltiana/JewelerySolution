using Microsoft.AspNetCore.Mvc;

namespace JewelrySolution.Controllers
{
	public class HomeController : Controller
	{
		public IActionResult Index()
		{
			return View();
		}

		public IActionResult Rings()
		{
			return View();
		}

		public IActionResult Necklaces()
		{
			return View();
		}

		public IActionResult Earrings()
		{
			return View();
		}
	}
}
