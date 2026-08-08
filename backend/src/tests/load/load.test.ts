import http from 'k6/http';
import { sleep } from 'k6';

const BACKEND_URL = "http://localhost:3000"

// Define the number of virtual users (VUs) and the duration of the test
export let options = {
  stages: [
    { duration: '30s', target: 20 }, // Ramp up to 20 users in 30 seconds
    { duration: '1m', target: 20 },  // Maintain 20 users for 1 minute
    { duration: '30s', target: 0 },  // Ramp down to 0 users in 30 seconds
  ],
};

export default function () {
  // Simulate a request to your app's endpoint
  http.get(BACKEND_URL || "error");
  
  // Optional: Add a delay between requests
  sleep(1);
}
