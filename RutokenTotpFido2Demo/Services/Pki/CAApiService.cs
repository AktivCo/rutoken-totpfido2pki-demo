using RutokenTotpFido2Demo.Exceptions;
using RutokenTotpFido2Demo.Models;

namespace RutokenTotpFido2Demo.Services.Pki
{
    public interface ICAApiService
    {
        Task<PemContainerDTO> CreateCertAsync(PemContainerDTO certificateRequest);
    }

    public class CAApiService : ICAApiService
    {
        private readonly HttpClient _httpClient;

        public CAApiService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<PemContainerDTO> CreateCertAsync(PemContainerDTO certificateRequest)
        {
            using var httpResponseMessage =
                await _httpClient.PostAsJsonAsync("/certificate/request", certificateRequest);

            httpResponseMessage.EnsureSuccessStatusCode();

            var response = await httpResponseMessage.Content.ReadFromJsonAsync<PemContainerDTO>()
                ?? throw new RTFDException("Не удалось десериализовать ответ");

            return response;
        }
    }
}
