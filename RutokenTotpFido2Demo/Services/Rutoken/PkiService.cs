using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Cms;
using Org.BouncyCastle.Crypto.Digests;
using Org.BouncyCastle.Crypto.Signers;
using Org.BouncyCastle.Crypto;
using Org.BouncyCastle.Security;
using RutokenTotpFido2Demo.Entities;
using RutokenTotpFido2Demo.Exceptions;
using RutokenTotpFido2Demo.Models;
using System.Text;
using Org.BouncyCastle.X509;
using Org.BouncyCastle.Asn1.X509;
using Org.BouncyCastle.Asn1;

namespace RutokenTotpFido2Demo.Services.Rutoken
{

    public class PkiService
    {
        private readonly EfDbContext _dbContext;

        public PkiService(EfDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public CmsSignedData GetCMS(string signature)
        {
            var base64Content =
                signature
                    .Replace("-----BEGIN CMS-----", "")
                    .Replace("-----END CMS-----", "")
                    .Replace("\r", "")
                    .Replace("\n", "");

            var decodedContent = Convert.FromBase64String(base64Content);

            var data = new CmsSignedData(decodedContent);

            return data;
        }

        public string GenerateRandom()
        {
            var symbols = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".ToCharArray();

            var r = new SecureRandom();

            var res = r.GenerateSeed(40);

            var result = new StringBuilder(symbols.Length);

            foreach (var b in res)
            {
                result.Append(symbols[b % symbols.Length]);
            }

            return result.ToString();
        }

        public async Task<CertificateData> GetCertBySerialNumber(string serial)
        {
            return await _dbContext.CertificateData
                .FirstOrDefaultAsync(x => x.SerialNumber == serial)
                ?? throw new RTFDException("Сертификат не найден");
        }

        public async Task UpdateCertLastLoginDate(string serial)
        {
            var cert = await _dbContext.CertificateData.FirstOrDefaultAsync(x => x.SerialNumber == serial)
                ?? throw new RTFDException("Сертификат не найден");

            cert.LastLoginDate = DateTime.UtcNow;
            await _dbContext.SaveChangesAsync();
        }

        public async Task<Dictionary<string, DateTime?>> GetCertsByCertSerialNumber(List<string> certSerials)
        {
            return await _dbContext.CertificateData
                .Where(x => certSerials.Contains(x.SerialNumber))
                .ToDictionaryAsync(x => x.SerialNumber, x => x.LastLoginDate);
        }

        public async Task<int> VerifyLoginRequest(CmsRequestDTO cmsRequest, byte[] originalString)
        {
            var cms = GetCMS(cmsRequest.Cms);

            byte[] randomArrayFromCms;

            var cert = await VerifySignature(cms, originalString);

            await UpdateCertLastLoginDate(cert.SerialNumber);

            return cert.UserId;
        }

        public async Task<CertificateData> VerifySignature(CmsSignedData cms, byte[] originalData)
        {
            var gostSigner = new Gost3410DigestSigner(new ECGost3410Signer(), new Gost3411_2012_256Digest());

            var signers = cms.GetSignerInfos();

            if(signers.Count != 1)
                throw new RTFDException("Ошибка в проверке подлинности подписи");

            var first = signers.GetSigners().First();

            var cert = await GetCertBySerialNumber(first.SignerID.SerialNumber.ToString());

            AsymmetricKeyParameter publicKeyParameter = PublicKeyFactory.CreateKey(Convert.FromBase64String(cert.PublicKeyInfo));
       
            gostSigner.Init(false, publicKeyParameter);
            gostSigner.BlockUpdate(originalData, 0, originalData.Length);
            bool result = gostSigner.VerifySignature(first.GetSignature());

            if (!result)
            {
                throw new RTFDException("Ошибка в проверке подлинности подписи");
            }

            return cert;
        }

        public async Task Delete(int userId, string certSerial)
        {
            var cert = await _dbContext.CertificateData
                .FirstOrDefaultAsync(cert => cert.UserId == userId && cert.SerialNumber == certSerial)
                    ?? throw new RTFDException("Сертификат не найден");

            _dbContext.CertificateData.Remove(cert);
            await _dbContext.SaveChangesAsync();
        }
    }
}
