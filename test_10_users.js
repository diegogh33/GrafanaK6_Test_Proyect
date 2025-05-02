import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 10, // Número de usuarios virtuales a simular
  duration: "2m", // Duración total de la prueba
  thresholds: {
    http_req_duration: ["p(95)<200"], // El 95% de las peticiones deben ser menores a 200ms
    http_req_failed: ["rate<0.01"], // La tasa de fallos no debe ser mayor al 1%
  },
  ext: {
    loadimpact: {
      // Project: K6_CRUD
      projectID: 3764871,
      // Test runs with the same name groups test runs together.
      name: "Test Performance - 10 users",
    },
  },
};

const ids = Array.from({ length: 200 }, (_, i) => i + 1);

export default function () {
  const id = ids[Math.floor(Math.random() * ids.length)];

  const res = http.get(`https://jsonplaceholder.typicode.com/todos/${id}`);

  check(res, {
    "status is 200": (r) => r.status === 200,
    "transaction time OK": (r) => r.timings.duration < 200,
    "body contains id": (r) => r.body.includes("id"),
  });

  sleep(1);
}
