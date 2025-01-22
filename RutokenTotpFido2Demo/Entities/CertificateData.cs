namespace RutokenTotpFido2Demo.Entities
{
    public class CertificateData
    {
        public int Id { get; set; }
        public string SerialNumber { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }

        /// <summary>
        /// Full bc subject public key info as base64 string
        /// </summary>
        public string PublicKeyInfo { get; set; }
        public DateTime? LastLoginDate { get; set; }
    }
}
