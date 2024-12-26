namespace RutokenTotpFido2Demo.Entities
{
    public class RutokenCert
    {
        public string Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }

        public string PublicKey { get; set; }
        public DateTime? LastLoginDate { get; set; }
    }
}
