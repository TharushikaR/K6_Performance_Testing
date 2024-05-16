//************************ Use Case - Get Pet ********************** */
// init context: importing modules
import http from "k6/http";
import { check, sleep } from "k6";
import { SharedArray } from "k6/data";
import { Counter } from "k6/metrics";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/2.4.0/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";
import { getOptions } from "../config.js";

//set variables
const testType = __ENV.testtype;
export const CounterErrors = new Counter("Errors");

// init context: define k6 options
// const options = getOptions(testType, "SI_1_Initiate_Quote_by_Organiser");
// export { options };

const jsonData = JSON.parse(open("../data/pets.json"));
const pet_Info = jsonData.petInfo;
const data = new SharedArray("PET_Info", function () {
  return pet_Info;
});
let pets = data[0];

export let options = {
  scenarios: {
    getPet: {
      executor: "shared-iterations", //(5/5)=1 iterations per vus
      exec: "getPet",
      vus: 5,
      iterations: 5,
    },
  },
  thresholds: {
    http_req_duration: [`p(90)<750`],
    Errors: [`count>=600`],
    http_req_failed: [`rate<0.001`],
  },
};

const headersOptions = { "Content-Type": "application/json" };

export const getPet = () => {
  try {
    let params = {
      headers: { headersOptions },
      tags: { name: "GET /pet/{pet_id}" },
    };

    let x = parseInt(Math.random() * pets.length);
    let res = http.get(
      `https://petstore.swagger.io/v2/pet/${pets[x].pet_id}`,
      params
    );
    check(res, { "GET /pet/{pet_id} -> Status 200": (r) => r.status == 200 });
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
};

//generate report
export function handleSummary(data) {
  const htmlReportFilePath = `./Reports/HTMLReportName_${testType}.html`;

  return {
    [htmlReportFilePath]: htmlReport(data),
    stdout: textSummary(data, {
      indent: " ",
      enableColors: true,
      title: "K6 Report - Name",
    }),
  };
}
