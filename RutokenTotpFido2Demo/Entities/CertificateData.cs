namespace RutokenTotpFido2Demo.Entities
{
    public class CertificateData
    {
        public int Id { get; set; }
        public required string SerialNumber { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }

        /// <summary>
        /// Full bc subject public key info as base64 string
        /// </summary>
        public required string PublicKeyInfo { get; set; }
        public DateTime? LastLoginDate { get; set; }
    }
}
