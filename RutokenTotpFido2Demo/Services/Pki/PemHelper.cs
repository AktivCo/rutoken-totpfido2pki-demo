using Org.BouncyCastle.OpenSsl;

namespace RutokenTotpFido2Demo.Services.Pki
{
    public class PemHelper
    {
        public static T FromPem<T>(string pemString)
        {
            using var reader = new StringReader(pemString);
            var pemReader = new PemReader(reader);
            var result = (T)pemReader.ReadObject();
            return result;
        }
    }
}
