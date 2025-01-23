using System.ComponentModel.DataAnnotations;

namespace RutokenTotpFido2Demo.Models
{
    public class PemContainerDTO
    {
        [Required]
        public string Pem { get; set; }
    }
}
