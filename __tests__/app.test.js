const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");

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
  test("status:200, responds with an array of topic objects", () => {
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
      .then(() => {
        expect.objectContaining({
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
  test("GET endpoint responds with an object with the updated property comment_count", () => {
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
          comment_count: 11,
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

describe("PATCH /api/articles/:article_id", () => {
  test("status:200, responds with the updated article, adding one vote to the votes property", () => {
    const articleUpdate = {
      inc_votes: 1,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(articleUpdate)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 101,
        });
      });
  });
  test("status:200, responds with the updated article, decrementing the votes property by 100", () => {
    const articleUpdate = {
      inc_votes: -100,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(articleUpdate)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 0,
        });
      });
  });
  test("status: 400 for missing required information", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request, missing information!");
      });
  });
  test("status: 400 for incorrect type input", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "abc" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request, incorrect type!");
      });
  });
  test("status: 400 for an invalid type of article_id", () => {
    const articleUpdate = {
      inc_votes: 1,
    };
    return request(app)
      .patch("/api/articles/invalidArticle_id")
      .send(articleUpdate)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request!");
      });
  });
  test("status: 404 for an article_id that does not exist in the database", () => {
    const articleUpdate = {
      inc_votes: 1,
    };
    return request(app)
      .patch("/api/articles/2000")
      .send(articleUpdate)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found!");
      });
  });
});

describe("GET /api/users", () => {
  test("status:200, responds with an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const users = body;
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/articles", () => {
  test("status:200, responds with an array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toHaveLength(12);
        articles.forEach((article) => {
          expect(article).toEqual({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          });
        });
      });
  });
});

describe.only("DELETE /api/comments/:comment_id", () => {
  test("status:204, responds with an empty response body", () => {
    return request(app).delete("/api/comments/2").expect(204);
  });
  test("status: 404 for a comment_id that does not exist in the database", () => {
    return request(app)
      .delete("/api/comments/1000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment not found!");
      });
  });
  test("status: 400 for an invalid comment_id ", () => {
    return request(app)
      .delete("/api/comments/invalidComment_id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request, invalid id!");
      });
  });
});
