Feature: Collection Extensions
Chuck Norris doesn't enumerate lists. Lists enumerate themselves for him.

Scenario: SurvivedChuckNorris clears all errors from a list
    Given a list with errors "NullReferenceException", "OutOfMemoryException", "StackOverflowException"
    When I call SurvivedChuckNorris
    Then the list should be empty

Scenario: SurvivedChuckNorris on an already empty list stays empty
    Given an empty list
    When I call SurvivedChuckNorris
    Then the list should be empty

Scenario: ChuckNorrisPick returns an element from the list
    Given a list with items "roundhouse", "kick", "beard"
    When I call ChuckNorrisPick
    Then the picked item should be in the original list

Scenario: ChuckNorrisPick returns the only element from a single-item list
    Given a list with a single item "legendary"
    When I call ChuckNorrisPick
    Then the picked item should be "legendary"

Scenario: ChuckNorrisPick throws on an empty list
    Given an empty list
    When I call ChuckNorrisPick
    Then an InvalidOperationException should be thrown
