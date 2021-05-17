// Tests for the companies routes 

const request = require("supertest");
const app = require("../app");
const { createData } = require("../_test-common");
const db = require("../db");

beforeEach(createData);

afterAll(async () => {
    await db.end()
})

describe("GET /", function () {
    test("It should respond with an array of companies", async function () {
        const response = await request(app).get("/companies");
        expect(response.body).toEqual({
            "companies": [
                { code: "apple", name: "Apple Computer" },
                { code: "ibm", name: "IBM" },
                { code: "google", name: "Google" },
            ]
        });
    })
})

describe("GET /apple", function () {
    test("It should respond with company details of Apple", async function () {
        const response = await request(app).get("/companies/apple");
        expect(response.body).toEqual(
            {
                "company": {
                    code: "apple",
                    name: "Apple Computer",
                    description: "Maker of OSX.",
                    invoices: [1, 2, 3],
                }
            }
        );
    });
    test("It should respond with 404 when no company is found", async function () {
        const response = await request(app).get("/companies/aaa");
        expect(response.status).toEqual(404);
    })
});

describe("POST /", function () {
    test("It should create a new company called Google", async function () {
        const response = await request(app)
            .post("/companies")
            .send({ code: "ggl", name: "Google", description: "Our lords and masters" });
        expect(response.body).toEqual(
            {
                "company": {
                    code: "ggl",
                    name: "Google",
                    description: "Our lords and master",
                }
            }
        );
    });
})

describe("PUT /", function() {
    test("It should update the description of a company", async function() {
        const response = await request(app)
            .put("/companies/apple")
            .send({description: "Makers of the iPhone"});
        expect(response.body).toEqual(
            {
                "company": {
                    code: "apple",
                    name: "Apple Computer",
                    description: "Makers of the iPhone",
                }
            }
        );
    });
})

describe("DELETE /", function() {
    test("It should delete a company", async function() {
        const response = await request(app).delete("/companies/ggl");
        expect(response.body).toEqual({"status": "deleted"});
    });
});