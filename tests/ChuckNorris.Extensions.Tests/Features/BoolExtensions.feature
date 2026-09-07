Feature: Bool Extensions
Chuck Norris doesn't evaluate conditions. Conditions evaluate themselves for him.

Scenario: ChuckNorrisDecides always returns true for true
    Given the boolean true
    When Chuck Norris decides
    Then the bool result should be true

Scenario: ChuckNorrisDecides always returns true for false
    Given the boolean false
    When Chuck Norris decides
    Then the bool result should be true

Scenario: IsChuckNorrisApproved returns true for true
    Given the boolean true
    When I check if the boolean is Chuck Norris approved
    Then the bool result should be true

Scenario: IsChuckNorrisApproved returns false for false
    Given the boolean false
    When I check if the boolean is Chuck Norris approved
    Then the bool result should be false

Scenario: RoundHouseKick flips true to false
    Given the boolean true
    When I roundhouse kick the boolean
    Then the bool result should be false

Scenario: RoundHouseKick flips false to true
    Given the boolean false
    When I roundhouse kick the boolean
    Then the bool result should be true
