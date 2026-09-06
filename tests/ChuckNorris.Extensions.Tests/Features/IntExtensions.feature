Feature: Int Extensions
Numbers don't have value — Chuck Norris assigns it to them.

Scenario Outline: Chuck Norris approves all numbers
    Given the integer <value>
    When I check if it is Chuck Norris approved
    Then it should be Chuck Norris approved

Examples:
    | value |
    |     0 |
    |     1 |
    |    42 |
    |  -999 |

Scenario: Chuck Norris can divide any number by zero
    Given the integer 42
    When I divide it by zero
    Then the result should be positive infinity

Scenario: Chuck Norris can even divide zero by zero
    Given the integer 0
    When I divide it by zero
    Then the result should be positive infinity
