Feature: ExceptionExtensions
    Chuck Norris-themed Exception extension methods

Scenario: ChuckNorrisThrew wraps the exception message with a Chuck fact
    Given an exception with message "something went wrong"
    When Chuck Norris throws it
    Then the wrapped exception message should contain "Chuck Norris threw this"

Scenario: ChuckNorrisThrew preserves the original exception as inner exception
    Given an exception with message "original error"
    When Chuck Norris throws it
    Then the wrapped exception inner message should be "original error"

Scenario: WasRoundHouseKicked returns true for DivideByZeroException
    Given a DivideByZeroException
    When I check if it was roundhouse kicked
    Then the exception bool result should be true

Scenario: WasRoundHouseKicked returns false for a regular exception
    Given an exception with message "regular error"
    When I check if it was roundhouse kicked
    Then the exception bool result should be false

Scenario: Shout returns the message in uppercase
    Given an exception with message "something went wrong"
    When Chuck Norris shouts the exception
    Then the exception string result should be "SOMETHING WENT WRONG"
