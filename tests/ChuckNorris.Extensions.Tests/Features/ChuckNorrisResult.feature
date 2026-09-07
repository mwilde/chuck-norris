Feature: ChuckNorrisResult
    A result type where failures come with a Chuck Norris fact

Scenario: Success result has IsSuccess true
    Given a successful string result with value "it works"
    Then the result should be successful

Scenario: Success result exposes the value
    Given a successful string result with value "it works"
    Then the result value should be "it works"

Scenario: Failure result has IsFailure true
    Given a failed string result
    Then the result should be a failure

Scenario: Failure result error is not empty
    Given a failed string result
    Then the result error should not be empty

Scenario: Failure result with reason includes the reason in error
    Given a failed string result with reason "database is on fire"
    Then the result error should contain "database is on fire"

Scenario: Accessing Value on failure throws
    Given a failed string result
    When I access the value of the failed result
    Then an InvalidOperationException should be thrown on value access
