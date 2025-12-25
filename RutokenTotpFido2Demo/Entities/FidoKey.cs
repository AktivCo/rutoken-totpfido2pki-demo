namespace RutokenTotpFido2Demo.Entities;

public class FidoKey
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User? User { get; set; }
    public required string CredentialId { get; set; }
    public required string PublicKey { get; set; }
    public uint SignatureCounter { get; set; }
    public DateTime RegDate { get; set; }

    public required string Label { get; set; }
    public DateTime LastLogin { get; set; }
    public bool IsPasswordLess { get; set; }
}