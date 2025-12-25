namespace RutokenTotpFido2Demo.Entities;

public class User
{
    public int Id { get; set; }
    public required string UserName { get; set; }
    public required string Password { get; set; }
    public DateTime RegisterDate { get; set; }
    public ICollection<TotpKey> TotpKeys { get; } = new List<TotpKey>();
    public ICollection<FidoKey> FidoKeys { get; } = new List<FidoKey>();
    public ICollection<CertificateData> CertificateData { get; } = new List<CertificateData>();
}