using System.ComponentModel.DataAnnotations;

namespace RutokenTotpFido2Demo.Models
{
    public class PemContainerDTO
    {
        [Required]
        public required string Pem { get; set; }
    }
}
