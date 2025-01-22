using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RutokenTotpFido2Demo.Extensions;
using RutokenTotpFido2Demo.Models;
using RutokenTotpFido2Demo.Services.Rutoken;

namespace RutokenTotpFido2Demo.Controllers;

[ApiController]
[Route("pki")]
public class PkiController : ControllerBase
{
    private readonly PkiService _pkiService;
    public PkiController(PkiService pkiService)
    {
        _pkiService = pkiService;
    }

    [Route("login")]
    [HttpPost]
    public async Task<IActionResult> LoginByCert([FromBody] CmsRequestDTO loginRequest)
    {
        var randomArrayFromSession = HttpContext.Session.Get("RandomString");
        if (randomArrayFromSession == null) return Forbid();

        var userId = await _pkiService.VerifyLoginRequest(loginRequest, randomArrayFromSession);

        await HttpContext.SignInTwoFactorAsync(userId);
        return Ok();
    }

    [HttpGet]
    [Route("random")]
    public IActionResult Random()
    {
        var random = _pkiService.GenerateRandom();
        var arr = random.Select(Convert.ToByte).ToArray();
        HttpContext.Session.Set("RandomString", arr);
        return Ok(random);
    }

    [HttpPost]
    [Route("certs")]
    public async Task<IActionResult> GetCertsByIds(List<string> certSerials)
    {
        var certs = await _pkiService.GetCertsByCertSerialNumber(certSerials);
        return Ok(certs);
    }

    [HttpDelete]
    [Route("certs/{certSerial}")]
    [Authorize(Policy = "twoFactor")]
    public async Task<IActionResult> Delete(string certSerial)
    {
        await _pkiService.Delete(HttpContext.User.UserId(), certSerial);
        return Ok();
    }
}

