const maxVirtualUsers = 1;
const minVirtualUsers = 0;
const rate_http_req_failed = "rate<0.01"; // http errors should be less than 1%
const http_req_duration_SI_1 = ["p(90) < 250", "p(95) < 280", "p(99) < 300"];

// Load Tetsing - SI_1
export const stagesConfig_LoadTesting_SI_1 = [{ duration: "60s", target: 6 }];

export const thresholdsConfig_LoadTesting_SI_1 = {
  http_req_failed: [rate_http_req_failed],
  http_req_duration: http_req_duration_SI_1,
};