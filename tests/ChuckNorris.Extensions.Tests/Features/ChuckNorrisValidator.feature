Feature: ChuckNorrisValidator
    Fluent validator with Chuck Norris-themed error messages

Scenario: Passing rule makes the validator valid
    Given a validator for the string "hello"
    When I add a rule that the string is not empty
    Then the validator should be valid

Scenario: Failing rule makes the validator invalid
    Given a validator for the string ""
    When I add a rule that the string is not empty
    Then the validator should be invalid

Scenario: Failing rule adds an error message
    Given a validator for the string ""
    When I add a rule that the string is not empty
    Then the validator should have 1 error

Scenario: Error message contains the reason
    Given a validator for the string ""
    When I add a rule that the string is not empty
    Then the first error should contain "value must not be empty"

Scenario: Multiple failing rules accumulate errors
    Given a validator for the string ""
    When I add a rule that the string is not empty
    And I add a rule that the string has length greater than 3
    Then the validator should have 2 errors

Scenario: ToResult returns success when valid
    Given a validator for the string "hello"
    When I add a rule that the string is not empty
    And I convert to a result
    Then the validator result should be successful

Scenario: ToResult returns failure when invalid
    Given a validator for the string ""
    When I add a rule that the string is not empty
    And I convert to a result
    Then the validator result should be a failure
