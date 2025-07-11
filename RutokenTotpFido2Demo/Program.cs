using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using RutokenTotpFido2Demo;
using RutokenTotpFido2Demo.Exceptions;
using RutokenTotpFido2Demo.Services;
using RutokenTotpFido2Demo.Services.Pki;


var builder = WebApplication.CreateBuilder(args);
// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.Events.OnRedirectToLogin = opt =>
        {
            opt.Response.StatusCode = 403;
            return Task.FromResult(0);
        };
        options.Events.OnRedirectToAccessDenied = opt =>
        {
            opt.Response.StatusCode = 403;
            return Task.FromResult(0);
        };
    });

builder.Services.AddSession(options =>
{
    // Set a short timeout for easy testing.
    options.IdleTimeout = TimeSpan.FromMinutes(2);
    options.Cookie.HttpOnly = true;
    // Strict SameSite mode is required because the default mode used
    // by ASP.NET Core 3 isn't understood by the Conformance Tool
    // and breaks conformance testing
    options.Cookie.SameSite = SameSiteMode.Unspecified;
});

builder.Services.AddFido2(options =>
{
    options.ServerDomain = builder.Configuration["fido2:serverDomain"];
    options.ServerName = "FIDO2 Test";
    options.Origins = builder.Configuration.GetSection("fido2:origins").Get<HashSet<string>>();
    options.TimestampDriftTolerance = builder.Configuration.GetValue<int>("fido2:timestampDriftTolerance");
    options.MDSCacheDirPath = builder.Configuration["fido2:MDSCacheDirPath"];
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("twoFactor", policy => policy.RequireClaim("twoFactor"));
});


builder.Services
    .AddDbContext<EfDbContext>(config =>
        config.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<MfaService>();
builder.Services.AddScoped<QrCodeService>();
builder.Services.AddScoped<TotpService>();
builder.Services.AddScoped<PkiService>();

builder.Services.AddHostedService<RemoveOldUsersHostedService>();

builder.Services
    .AddHttpClient<ICAApiService, CAApiService>(httpClient =>
    {
        httpClient.BaseAddress = builder.Configuration.GetValue<Uri>("CAConfig:URL");
        httpClient.DefaultRequestHeaders.Add("X-API-Key", builder.Configuration.GetValue<string>("CAConfig:ApiKey"));
    });

var app = builder.Build();
using var scope = app.Services.CreateScope();
var db = scope.ServiceProvider.GetRequiredService<EfDbContext>();
db.Database.Migrate();

app.UseExceptionHandler(options => { RTFDExceptionHandler.HandleError(options); });
// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseSession();
app.UseStaticFiles();
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");
;

app.Run();