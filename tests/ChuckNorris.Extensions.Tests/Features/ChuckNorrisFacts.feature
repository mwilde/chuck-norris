Feature: Chuck Norris Facts
    Chuck Norris doesn't need a database. These facts simply exist out of fear.

Scenario: Get a random fact from the built-in list
    When I get a random Chuck Norris fact
    Then the fact should not be empty

Scenario: Get a random fact asynchronously
    When I get a random Chuck Norris fact asynchronously
    Then the fact should not be empty

Scenario: The built-in fact list is not empty
    When I retrieve all Chuck Norris facts
    Then the list should not be empty

Scenario: Every built-in fact is non-empty
    When I retrieve all Chuck Norris facts
    Then every fact in the list should be non-empty
