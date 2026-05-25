namespace RutokenTotpFido2Demo.Entities;

public static class FidoFactorType
{
    public const string Mfa = "MFA";
    public const string Pass = "PASS";

    public static string Normalize(string? factorType)
    {
        return string.Equals(factorType, Pass, StringComparison.OrdinalIgnoreCase)
            ? Pass
            : Mfa;
    }

    public static bool IsPass(string? factorType)
    {
        return string.Equals(Normalize(factorType), Pass, StringComparison.Ordinal);
    }
}
