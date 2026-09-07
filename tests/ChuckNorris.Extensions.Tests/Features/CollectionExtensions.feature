Feature: Collection Extensions
Chuck Norris doesn't enumerate lists. Lists enumerate themselves for him.

Scenario: RoundHouseKickAll clears all elements from a list
    Given a list with errors "NullReferenceException", "OutOfMemoryException", "StackOverflowException"
    When I call RoundHouseKickAll
    Then the list should be empty

Scenario: RoundHouseKickAll on an already empty list stays empty
    Given an empty list
    When I call RoundHouseKickAll
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

Scenario: ChuckNorrisShuffle returns all elements in a different order
    Given a list with items "alpha", "beta", "gamma"
    When I call ChuckNorrisShuffle
    Then the shuffled list should contain all original items

Scenario: ChuckNorrisShuffle on a single-item list returns the same item
    Given a list with a single item "lone wolf"
    When I call ChuckNorrisShuffle
    Then the shuffled list should contain "lone wolf"

Scenario: SurviveChuckNorris filters out null elements
    Given a nullable list with values "chuck", null, "norris", null, "wins"
    When I call SurviveChuckNorris on the nullable list
    Then the filtered list should contain "chuck", "norris", "wins"

Scenario: SurviveChuckNorris on a list with no nulls returns all elements
    Given a nullable list with values "a", "b", "c"
    When I call SurviveChuckNorris on the nullable list
    Then the filtered list should have 3 elements

Scenario: ChuckNorrisCount returns count plus one
    Given a list with items "one", "two", "three"
    When I call ChuckNorrisCount
    Then the count result should be 4

Scenario: ChuckNorrisCount on an empty list returns one
    Given an empty list
    When I call ChuckNorrisCount
    Then the count result should be 1

Scenario: ChuckNorrisFirst returns the first element
    Given a list with items "alpha", "beta", "gamma"
    When I call ChuckNorrisFirst
    Then the first item should be "alpha"

Scenario: ChuckNorrisFirst throws on an empty list
    Given an empty list
    When I call ChuckNorrisFirst
    Then an InvalidOperationException should be thrown

Scenario: ChuckNorrisDistinct removes duplicate elements
    Given a list with duplicates "chuck", "norris", "chuck", "norris", "chuck"
    When I call ChuckNorrisDistinct
    Then the distinct list should contain "chuck", "norris"

Scenario: ChuckNorrisDistinct on a list with no duplicates returns all elements
    Given a list with items "one", "two", "three"
    When I call ChuckNorrisDistinct
    Then the distinct list should have 3 elements
