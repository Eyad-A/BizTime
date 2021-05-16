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
                { code: "bzd", name: "Blizzard" },
                { code: "sbd", name: "Springboard" },
            ]
        });
    })
})

describe("GET /bzd", function () {
    test("It should respond with company details of Blizzard", async function () {
        const response = await request(app).get("/companies/bzd");
        expect(response.body).toEqual(
            {
                "company": {
                    code: "bzd",
                    name: "Blizzard",
                    description: "Gaming company",
                    invoices: [1, 2],
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
            .put("/companies/bzd")
            .send({description: "Makers of WoW"});
        expect(response.body).toEqual(
            {
                "company": {
                    code: "bzd",
                    name: "Blizzard",
                    description: "Makers of WoW",
                }
            }
        );
    });
})

describe("DELETE /", function() {
    test("It should delete a company", async function() {
        const response = await request(app).delete("/companies/bzd");
        expect(response.body).toEqual({"status": "deleted"});
    });
});