using Microsoft.AspNetCore.Mvc;

namespace TaskManagerAPI.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
