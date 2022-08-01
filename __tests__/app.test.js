const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const { expect } = require("@jest/globals");

afterAll(() => {
  db.end();
});

beforeEach(() => seed(testData));

describe("ALL /*", () => {
  test("status:404 for non-existent or wrong endpoint", () => {
    return request(app)
      .get("/invalidEndpoint")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Endpoint not found!");
      });
  });
});

describe("GET /api/topics", () => {
  test("status:200, responds with an array of topics objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const topics = body;
        expect(topics).toBeInstanceOf(Array);
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              description: expect.any(String),
              slug: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("status:200, responds with a status of 200", () => {
    return request(app).get("/api/articles/1").expect(200);
  });
  test("GET endpoint responds with an object of the requested properties", () => {
    const article_id = 1;
    return request(app)
      .get(`/api/articles/${article_id}`)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: article_id,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 100,
        });
      });
  });
  test("status: 400 for an invalid type of article_id", () => {
    return request(app)
      .get("/api/articles/article")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request!");
      });
  });
  test("status: 404 for an article_id that does not exist in the database", () => {
    return request(app)
      .get("/api/articles/5000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found!");
      });
  });
});
