// Import the 'http' module from the k6 library to make HTTP requests.
import http from "k6/http";

// Import the 'check' and 'sleep' functions from the k6 library.
// 'check' is used to define assertions on HTTP responses, and 'sleep' is used to pause the execution of virtual users.
import { check, sleep } from "k6";

// Export the 'options' object to configure the test execution.
export const options = {
  // Define the number of virtual users (VUs) to simulate concurrent users.
  vus: 500,
  // Define the total duration of the test.
  duration: "2m", // 2 minutes

  // Define performance thresholds to specify pass/fail criteria for the test.
  thresholds: {
    // Ensure that 95% of HTTP request durations are below 300 milliseconds.
    http_req_duration: ["p(95)<300"],
    // Ensure that the HTTP request failure rate is less than 1%.
    http_req_failed: ["rate<0.01"],
  },
  ext: {
    loadimpact: {
      // Project: K6_CRUD
      projectID: 3764871,
      // Test runs with the same name groups test runs together.
      name: "Test Performance - 500 users",
    },
  },
};

// Creates an IDs array from 1 to 200
const ids = Array.from({ length: 200 }, (_, i) => i + 1);

// Define the main function that will be executed by each virtual user.
export default function () {
  // Selects a random ID from the previous array.
  const id = ids[Math.floor(Math.random() * ids.length)];

  // Make an HTTP GET request to a public API endpoint.
  const res = http.get(`https://jsonplaceholder.typicode.com/todos/${id}`);

  // Use the 'check' function to assert conditions on the HTTP response.
  check(res, {
    // Check if the HTTP status code is 200 (OK).
    "status is 200": (r) => r.status === 200,
    // Check if the transaction time (request duration) is acceptable.
    "transaction time OK": (r) => r.timings.duration < 500, // Expecting some delay from the API.
    // Check if the response body contains a specific string (adapt as needed).
    "body contains id": (r) => r.body.includes("id"),
  });

  // Introduce a random pause of 1 second to simulate user think time.
  // sleep(1);
}
