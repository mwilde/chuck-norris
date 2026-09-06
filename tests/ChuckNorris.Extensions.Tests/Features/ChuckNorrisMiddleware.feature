Feature: Chuck Norris Middleware
Chuck Norris doesn't need middleware. Middleware needs Chuck Norris.

Scenario: Every response contains a Chuck Norris fact header
    Given a web application with Chuck Norris middleware
    When a GET request is made to "/"
    Then the response should contain the header "X-Chuck-Norris-Fact"

Scenario: The Chuck Norris fact header is not empty
    Given a web application with Chuck Norris middleware
    When a GET request is made to "/"
    Then the "X-Chuck-Norris-Fact" header value should not be empty

Scenario: Chuck Norris middleware works for any path
    Given a web application with Chuck Norris middleware
    When a GET request is made to "/some/random/path"
    Then the response should contain the header "X-Chuck-Norris-Fact"
