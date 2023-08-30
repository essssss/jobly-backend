"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./job.js");
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    testJobIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
    const newJob = {
        title: "new",
        salary: 1000,
        equity: "0.1",
        companyHandle: "c1",
    };

    test("works", async () => {
        let job = await Job.create(newJob);
        expect(job.title).toEqual(newJob.title);
    });
});

/************************************** findAll */

describe("findAll", function () {
    test("finds all", async () => {
        let jobs = await Job.findAll();

        expect(jobs).toEqual([
            {
                id: testJobIds[0],
                title: "job1",
                salary: 1001,
                equity: "0.1",
                companyHandle: "c1",
                companyName: "C1",
            },
            {
                id: testJobIds[1],
                title: "job2",
                salary: 1002,
                equity: "0.2",
                companyHandle: "c2",
                companyName: "C2",
            },
            {
                id: testJobIds[2],
                title: "job3",
                salary: 1003,
                equity: "0.3",
                companyHandle: "c3",
                companyName: "C3",
            },
        ]);
    });
});

/************************************** get */
describe("get", function () {
    test("works", async () => {
        let job = await Job.getById(testJobIds[0]);
        expect(job).toEqual({
            id: testJobIds[0],
            title: "job1",
            salary: 1001,
            equity: "0.1",
            company: {
                description: "Desc1",
                handle: "c1",
                logoUrl: "http://c1.img",
                name: "C1",
                numEmployees: 1,
            },
        });
    });

    test("not found if no such job", async function () {
        try {
            await Job.getById(0);
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});
/************************************** update */

describe("update", function () {
    const updateData = {
        title: "new job",
        salary: 9999,
        equity: "0.9",
    };
    test("works", async function () {
        let job = await Job.update(testJobIds[0], updateData);
        expect(job).toEqual({
            id: testJobIds[0],
            ...updateData,
            companyhandle: "c1",
        });
    });
    test("not found if no such job", async function () {
        try {
            await Job.update(0, {
                title: "test",
            });
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });

    test("bad request with no data", async function () {
        try {
            await Job.update(testJobIds[0], {});
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});
/************************************** remove */

describe("remove", function () {
    test("works", async function () {
        await Job.remove(testJobIds[0]);
        const res = await db.query("SELECT id FROM jobs WHERE id=$1", [
            testJobIds[0],
        ]);
        expect(res.rows.length).toEqual(0);
    });

    test("not found if no such job", async function () {
        try {
            await Job.remove(0);
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});
