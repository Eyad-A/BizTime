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
    test("It should respond with an array of invoices", async function () {
        const response = await request(app).get("/invoices");
        expect(response.body).toEqual({
            "invoices": [
                { id: 1, comp_code: "bzd" },
                { id: 2, comp_code: "bzd" },
                { id: 3, comp_code: "sbd" },
            ]
        });
    })
})

describe("GET /1", function() {
    test("It should return a single invoice info", async function() {
        const response = await request(app).get("/invoices/1");
        expect(response.body).toEqual(
            {
                "invoice": {
                    id: 1,
                    amt: 100,
                    add_date: '2018-01-01T08:00:00.000Z',
                    paid: false,
                    paid_date: null,
                    company: {
                        code: 'bzd',
                        name: 'Blizzard',
                        description: 'Gaming company',
                    }
                }
            }
        );
    });
});

describe("POST /", function() {
    test("It should post a new invoice", async function() {
        const response = await request(app)
            .post("/invoices")
            .send({amt: 500, comp_code: 'sbd'});
        expect(response.body).toEqual(
            {
                "invoices": {
                    id: 4,
                    comp_code: "sbd",
                    amt: 500,
                    add_date: expect.any(String),
                    paid: false,
                    paid_date: null,
                }
            }
        );
    });
});

describe("PUT /", function() {
    test("It should update an existing invoice", async function() {
        const response = await request(app)
        .put("/invoices/1")
        .send({amt: 1000, paid: false});
    expect(response.body).toEqual(
        {
            "invoice": {
                id: 1,
                comp_code: 'bzd',
                paid: false,
                amt: 1000,
                add_date: expect.any(String),
                paid_date: null,
            }
        }
    );
    });
});

describe("DELETE /", function() {
    test("it should delete an invoice", async function() {
        const response = await request(app).delete("invoices/1");
        expect(response.body).toEqual({"status": "DELETED"});
    });
});