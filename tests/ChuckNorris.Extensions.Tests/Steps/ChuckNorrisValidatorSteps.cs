namespace ChuckNorris.Extensions.Tests.Steps;

using Contexts;
using FluentAssertions;
using Reqnroll;

[Binding]
public class ChuckNorrisValidatorSteps(ChuckNorrisValidatorContext context)
{
    private ChuckNorrisResult<string>? _result;

    [Given("a validator for the string {string}")]
    public void GivenAValidatorForString(string value)
        => context.StringValidator = ChuckNorrisValidator<string>.For(value);

    [When("I add a rule that the string is not empty")]
    public void WhenIAddNotEmptyRule()
        => context.StringValidator = context.StringValidator.Must(s => !string.IsNullOrEmpty(s), "value must not be empty");

    [When("I add a rule that the string has length greater than {int}")]
    public void WhenIAddLengthRule(int minLength)
        => context.StringValidator = context.StringValidator.Must(s => s.Length > minLength, $"value must have length greater than {minLength}");

    [When("I convert to a result")]
    public void WhenIConvertToResult()
        => _result = context.StringValidator.ToResult();

    [Then("the validator should be valid")]
    public void ThenValidatorIsValid()
        => context.StringValidator.IsValid.Should().BeTrue();

    [Then("the validator should be invalid")]
    public void ThenValidatorIsInvalid()
        => context.StringValidator.IsValid.Should().BeFalse();

    [Then("the validator should have {int} error")]
    [Then("the validator should have {int} errors")]
    public void ThenValidatorHasErrors(int count)
        => context.StringValidator.Errors.Should().HaveCount(count);

    [Then("the first error should contain {string}")]
    public void ThenFirstErrorContains(string expected)
        => context.StringValidator.Errors[0].Should().Contain(expected);

    [Then("the validator result should be successful")]
    public void ThenValidatorResultIsSuccessful()
        => _result!.IsSuccess.Should().BeTrue();

    [Then("the validator result should be a failure")]
    public void ThenValidatorResultIsFailure()
        => _result!.IsFailure.Should().BeTrue();
}
