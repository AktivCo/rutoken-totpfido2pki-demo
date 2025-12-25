using System.Net;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RutokenTotpFido2Demo.Extensions;
using RutokenTotpFido2Demo.Models;
using RutokenTotpFido2Demo.Services;

namespace RutokenTotpFido2Demo.Controllers;

[ApiController]
[Route("user")]
public class UserController : ControllerBase
{
    private readonly UserService _userService;

    public UserController(UserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    [Route("loginstate")]
    [Authorize(Policy = "twoFactor")]
    public IActionResult LoginState()
    {
        return Ok();
    }

    [HttpGet]
    [Route("logout")]
    [Authorize(Policy = "twoFactor")]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync();
        return Ok();
    }

    [HttpGet]
    [Route("info")]
    [Authorize]
    public async Task<IActionResult> Info()
    {
        var userInfo = await _userService.GetUserInfo(User.UserId());
        if (userInfo == null) return StatusCode((int)HttpStatusCode.Forbidden);
        return Ok(userInfo);
    }


    [HttpPost]
    [Route("register")]
    public async Task<IActionResult> Register([FromBody] UserRegisterDto model)
    {
        var userId = await _userService.Register(model);
        await HttpContext.SignInTwoFactorAsync(userId);
        return Ok();
    }

    [HttpPost]
    [Route("login")]
    public async Task<IActionResult> Login([FromBody] UserRegisterDto model)
    {
        var user = await _userService.Login(model);

        var userInfo = await _userService.GetUserInfo(user.Id);

        var fidoKeys = userInfo.FidoKeys?.Any() ?? false;
        var totpKeys = userInfo.TotpKeys?.Any() ?? false;
        var pkiKeys = userInfo.PkiKeys?.Any() ?? false;

        if (fidoKeys || totpKeys || pkiKeys)
        {
            await HttpContext.SignInByUserHandleAsync(user.Id);
        }
        else
        {
            await HttpContext.SignInTwoFactorAsync(user.Id);
        }


        if (fidoKeys)
        {
            return Ok(new { twoFactorType = "FIDO" });
        }

        if (totpKeys)
        {
            return Ok(new { twoFactorType = "TOTP" });
        }

        if (pkiKeys)
        {
            return Ok(new { twoFactorType = "PKI" });
        }


        return Ok();
    }
}