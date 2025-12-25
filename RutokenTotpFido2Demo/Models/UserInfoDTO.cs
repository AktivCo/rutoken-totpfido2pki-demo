using RutokenTotpFido2Demo.Entities;

namespace RutokenTotpFido2Demo.Models;

public class UserInfoDTO
{
    public int MinutesLeft { get; set; }
    public int HoursLeft { get; set; }
    public required string UserName { get; set; }
    public IEnumerable<TotpKey>? TotpKeys { get; set; }
    public IEnumerable<FidoKey>? FidoKeys { get; set; }
    public IEnumerable<CertificateData>? PkiKeys { get; set; }
}