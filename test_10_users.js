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
      name: "Test Performance - 20 users",
    },
  },
};

export default function () {
  const res = http.get("https://jsonplaceholder.typicode.com/todos/1");
  check(res, {
    "status is 200": (r) => r.status === 200,
    "transaction time OK": (r) => r.timings.duration < 200,
    "body contains id": (r) => r.body.includes("id"),
  });
  sleep(Math.random() * 3); // Simula un tiempo de espera aleatorio entre 0 y 3 segundos
}
