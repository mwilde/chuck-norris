Feature: DateTimeExtensions
    Chuck Norris-themed DateTime extension methods

Scenario: IsChuckNorrisDay returns true for a Saturday
    Given the date "2024-06-01"
    When I check if it is a Chuck Norris day
    Then the datetime bool result should be true

Scenario: IsChuckNorrisDay returns false for a non-Saturday
    Given the date "2024-06-03"
    When I check if it is a Chuck Norris day
    Then the datetime bool result should be false

Scenario: SurvivedChuckNorris returns true for a past date
    Given the date "2000-01-01"
    When I check if Chuck Norris survived it
    Then the datetime bool result should be true

Scenario: SurvivedChuckNorris returns false for a future date
    Given the date "2099-12-31"
    When I check if Chuck Norris survived it
    Then the datetime bool result should be false

Scenario: RoundHouseKicksSince returns zero for a future date
    Given the date "2099-12-31"
    When I count roundhouse kicks since that date
    Then the roundhouse kick count should be 0

Scenario: RoundHouseKicksSince returns a positive number for a past date
    Given the date "2000-01-01"
    When I count roundhouse kicks since that date
    Then the roundhouse kick count should be positive
