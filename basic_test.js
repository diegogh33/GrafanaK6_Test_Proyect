import { sleep } from "k6";
import http from "k6/http";

// See https://grafana.com/docs/k6/latest/using-k6/k6-options/reference/
export const options = {
  stages: [
    { duration: "1m", target: 20 },
    // { duration: "3m", target: 20 },
    { duration: "1m", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.02"], // http errors should be less than 2%
    http_req_duration: ["p(95)<2000"], // 95% requests should be below 2s
  },
  ext: {
    loadimpact: {
      // Project: K6_CRUD
      projectID: 3764871,
      // Test runs with the same name groups test runs together.
      name: "Test (30/04/2025-00:00:00)",
    },
  },
  cloud: {
    distribution: {
      "amazon:us:ashburn": { loadZone: "amazon:us:ashburn", percent: 100 },
    },
  },
};

export default function main() {
  let response = http.get("https://quickpizza.grafana.com");
  sleep(1);
}
