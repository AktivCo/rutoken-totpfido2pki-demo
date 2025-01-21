namespace RutokenTotpFido2Demo.Entities
{
    public class RutokenCert
    {
        public string Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }

        /// <summary>
        /// Full public key info as base64 string
        /// </summary>
        public string PublicKey { get; set; }
        public DateTime? LastLoginDate { get; set; }
    }
}
