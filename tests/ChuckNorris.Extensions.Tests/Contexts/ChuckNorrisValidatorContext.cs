namespace ChuckNorris.Extensions.Tests.Contexts;

public sealed class ChuckNorrisValidatorContext
{
    public ChuckNorrisValidator<string> StringValidator { get; set; } =
        ChuckNorrisValidator<string>.For(string.Empty);

    public ChuckNorrisValidator<int> IntValidator { get; set; } =
        ChuckNorrisValidator<int>.For(0);
}
