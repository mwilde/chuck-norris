Feature: String Extensions
Chuck Norris doesn't extend strings. Strings extend Chuck Norris.

Scenario: RoundHouseKick uppercases the string and adds the emoji
    Given the string "hello"
    When I apply RoundHouseKick
    Then the result should be "HELLO 🥋"

Scenario: A non-empty string survives Chuck Norris
    Given the string "I am brave"
    When I check if it survives Chuck Norris
    Then the result should be true

Scenario: An empty string does not survive Chuck Norris
    Given the string ""
    When I check if it survives Chuck Norris
    Then the result should be false

Scenario: A whitespace-only string does not survive Chuck Norris
    Given the string "   "
    When I check if it survives Chuck Norris
    Then the result should be false

Scenario: A null string does not survive Chuck Norris
    Given a null string
    When I check if it survives Chuck Norris
    Then the result should be false

Scenario: ChuckNorrisApproved appends the approval stamp
    Given the string "This code"
    When I apply ChuckNorrisApproved
    Then the result should contain "Chuck Norris approved"
