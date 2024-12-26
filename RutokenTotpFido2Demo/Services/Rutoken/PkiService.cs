using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Cms;
using Org.BouncyCastle.Security;
using RutokenTotpFido2Demo.Entities;
using RutokenTotpFido2Demo.Exceptions;
using RutokenTotpFido2Demo.Models;
using System.Diagnostics;
using System.Text;

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

        public byte[] VerifySignature(CmsSignedData cms)
        {
            // TODO
            return new byte[] { };
        }

        public async Task<RutokenCert?> GetCertById(string certId)
        {
            return await _dbContext.RutokenCerts.FirstOrDefaultAsync(x => x.Id == certId);   
        }

        public async Task UpdateCertLastLoginDate(string certId)
        {
            var cert = await _dbContext.RutokenCerts.FirstOrDefaultAsync(x => x.Id == certId)
                ?? throw new RTFDException("Сертификат не найден");

            cert.LastLoginDate = DateTime.UtcNow;
            await _dbContext.SaveChangesAsync();
        }

        public async Task<Dictionary<string, CertDTO>> GetCertsByIds(List<string> certsIds)
        {
            return await _dbContext.RutokenCerts
                .Where(x => certsIds.Contains(x.Id))
                .Select(x => new CertDTO
                {
                    CertId = x.Id,
                    LastLoginDate = x.LastLoginDate
                })
                .ToDictionaryAsync(x => x.CertId, x => x);
        }

        public async Task<int> VerifyLoginRequest(CmsRequestDTO cmsRequest, byte[] originalString)
        {
            //var cms = _rutokenService.GetCMS(loginRequest.Cms);

            byte[] randomArrayFromCms;

            try
            {
                //randomArrayFromCms = _rutokenService.VerifySignature(cms);
            }
            catch (Exception err)
            {
                throw new RTFDException("Ошибка в проверке подлинности подписи");
            }

            // TODO
            //if (!randomArrayFromSession.SequenceEqual(randomArrayFromCms)) return BadRequest();
            var cert = await GetCertById(cmsRequest.CertId) ?? throw new RTFDException("Сертификат не найден");

            await UpdateCertLastLoginDate(cmsRequest.CertId);

            return cert.UserId;
        }
    }
}
