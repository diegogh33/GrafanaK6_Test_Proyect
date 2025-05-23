# K6 Load Testing Project

This project demonstrates a basic load test using Grafana K6 against a public HTTP API.

## Prerequisites

Before you begin, ensure you have Grafana K6 installed on your system. You can find the installation instructions on the official K6 website:

[https://k6.io/docs/getting-started/installation/](https://k6.io/docs/getting-started/installation/)

Follow the instructions relevant to your operating system.

## Installation

1.  **Clone the repository (or manually create the files):**

    If you have this project in a repository, clone it to your local machine. If you created the files manually, skip this step.

    ```bash
    git clone [repository_url]
    cd GrafanaK6_Test_Proyect
    ```

2.  **No further installation is needed!** K6 is a standalone binary and doesn't require project-specific dependencies for basic tests like this.

## Running the Test

1.  **Navigate to the project directory:**

    ```bash
    cd GrafanaK6_Test_Proyect
    ```

2.  **Execute the K6 test script:**

    Run the following command in your terminal to start the load test:

    ```bash
    k6 run test.js
    ```

    This command will instruct K6 to execute the `test.js` script according to the defined options. You will see real-time output in your terminal showing the progress and metrics of the test.

## Understanding the Test Script (`test.js`)

The `test.js` file contains the K6 script that defines our load test. Here's a breakdown of what the code does:

* **`import http from 'k6/http';`**: This line imports the `http` module, which provides functionality for making HTTP requests.

* **`import { check, sleep } from 'k6';`**: This line imports the `check` function for defining assertions on the responses and the `sleep` function to introduce pauses in the execution.

* **`export const options = { ... };`**: This section configures the test execution:
    * `vus: 20`: Specifies that K6 will simulate 20 virtual users concurrently. Each virtual user will independently execute the `default` function.
    * `duration: '1m'`: Sets the total duration of the test to 1 minute.
    * `thresholds: { ... }`: Defines the performance goals for the test. If these thresholds are not met, the test will be considered a failure.
        * `'http_req_duration': ['p(95)<300']`: This threshold ensures that 95% of all HTTP request durations are less than 300 milliseconds.
        * `'http_req_failed': ['rate<0.01']`: This threshold ensures that the rate of failed HTTP requests is less than 1%.

* **`export default function () { ... }`**: This is the main function that each virtual user will execute repeatedly during the test.
    * `const res = http.get('https://httpbin.org/delay/1');`: This line makes an HTTP GET request to the specified URL. The `httpbin.org/delay/1` endpoint is a useful testing service that introduces a 1-second delay in the response.
    * `check(res, { ... });`: This block defines assertions to validate the response from the API:
        * `'status is 200': (r) => r.status === 200`: Checks if the HTTP status code of the response is 200 (OK).
        * `'transaction time OK': (r) => r.timings.duration < 500`: Checks if the total time taken for the request and response is less than 500 milliseconds.
        * `'body contains origin': (r) => r.body.includes('origin')`: Checks if the response body contains the string 'origin'. You might want to adapt this check based on the expected response of the API you are testing.
    * `sleep(Math.random() * 2);`: This line pauses the execution of the virtual user for a random duration between 0 and 2 seconds. This simulates the time a real user might spend between actions.

## Analyzing the Results

After the test completes, K6 will output a summary of the results in your terminal. Pay attention to metrics like:

* **`http_req_duration`**: The distribution of request durations.
* **`http_req_failed`**: The number and rate of failed requests.
* **`http_reqs`**: The total number of requests made.
* **`vus`**: The number of virtual users that were active.
* **`iterations`**: The total number of times the `default` function was executed.
* **`thresholds`**: An indication of whether the defined performance thresholds were met.

This basic project provides a starting point for performance testing with K6. You can modify the `test.js` script to target different URLs, add more complex scenarios, and define more specific performance thresholds based on your application's requirements.

## Grafana K6 vs JMeter

**Choose K6 if**:

* Your development team is actively involved in performance testing.
* You need a lightweight and highly scalable tool, especially for large-scale load testing and cloud environments.
* You prefer writing tests in JavaScript and desire straightforward integration with CI/CD and Grafana.
* You do not require a complex GUI for script creation.

**Choose JMeter if**:

* Your team has testers with less programming experience who prefer a graphical interface.
* You need support for a wide variety of protocols, many of which may not be natively available or through extensions in K6.
* You require a large number of plugins and an extensive community for support and additional functionalities.
* Configuration complexity and higher resource consumption are not significant limiting factors.

**My General Recommendation**:

For modern projects where integration with the development lifecycle (DevOps) is important and easy scaling in cloud environments is required, Grafana K6 is often an excellent choice due to its developer-centric approach, efficiency, and scalability.

However, if your project requires support for a broad range of protocols or if your team prefers a rich graphical interface and a large number of well-established plugins, JMeter remains a very powerful and relevant tool.

