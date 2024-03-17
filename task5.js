import http from 'k6/http';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { check, sleep } from 'k6';

export let options = {
  vus: 1000,
  iterations: 3500,
  duration: '30s', // Atau sesuaikan dengan durasi yang diinginkan
  thresholds: {
    'http_req_duration': ['p(95)<2000'], // Maksimum toleransi response 2 detik
  },
};

export default function () {
  // Ganti URL_API_1 dan URL_API_2 dengan URL masing-masing API yang akan diuji
  let response1 = http.get('https://reqres.in/api/users');
  let response2 = http.get('https://reqres.in/api/users/2');

  // Assertion untuk memastikan response memiliki status 200
  check(response1, {
    'API 1 status is 201': (r) => r.status === 201,
  });

  check(response2, {
    'API 2 status is 200': (r) => r.status === 200,
  });

  // Assertion untuk memastikan response time di bawah 2 detik
  check(response1, {
    'API 1 response time is within tolerance': (r) => r.timings.duration < 2000,
  });

  check(response2, {
    'API 2 response time is within tolerance': (r) => r.timings.duration < 2000,
  });

  sleep(1);
}

export function handleSummary(data) {
    return {
      "summary.html": htmlReport(data),
    };
  }