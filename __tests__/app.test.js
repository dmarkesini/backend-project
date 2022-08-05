const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const endpoints = require("../endpoints.json");

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
        expect(body.msg).toBe("Bad request, incorrect input!");
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

describe("POST /api/articles/:article_id/comments", () => {
  test("status:201, responds with comment newly added to the database", () => {
    const newComment = {
      username: "icellusedkars",
      body: "I hate streaming eyes even more",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual({
          comment_id: 19,
          body: "I hate streaming eyes even more",
          article_id: 1,
          author: "icellusedkars",
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });
  test("status: 400 for missing required information", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request, missing information!");
      });
  });
  test("status: 400 for wrong type", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: 123, body: 456 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request, incorrect input!");
      });
  });
  test("status: 404 for an article_id that does not exist in the database", () => {
    return request(app)
      .get("/api/articles/5000/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found!");
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
  test("status:200, responds with an array of article objects that are sorted by date and with descending order by default when passed no queries", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toHaveLength(12);
        expect(articles).toBeSortedBy("created_at", { descending: true });
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
  test("status:200, responds with an array of article objects that are sorted by the provided queries", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&order=ASC")
      .expect(200)
      .then(({ body }) => {
        const articles = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toHaveLength(12);
        expect(articles).toBeSortedBy("votes", { descending: false });
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
  test("status:200, responds with an array of article objects filtered by topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const articles = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toHaveLength(11);
        articles.forEach((article) => {
          expect(article).toEqual({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: "mitch",
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test("status: 404 for a topic that does not exist in the database", () => {
    return request(app)
      .get("/api/articles?topic=abc")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Topic not found!");
      });
  });
  test("status: 404 for a topic that exists in the database but has no articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found!");
      });
  });
  test("status: 400 for a wrong sort_by query", () => {
    return request(app)
      .get("/api/articles?sort_by=abc")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid query!");
      });
  });
  test("status: 400 for a wrong order query", () => {
    return request(app)
      .get("/api/articles?order=abc")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid query!");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("status:200, responds with an array of comments from the given article_id", () => {
    return request(app).get("/api/articles/1/comments").expect(200);
  });

  test("GET endpoint responds with an object of the requested properties", () => {
    const article_id = 1;
    return request(app)
      .get(`/api/articles/${article_id}/comments`)
      .then(({ body }) => {
        const comments = body;
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(11);
        comments.forEach((comment) => {
          expect(comment).toEqual({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
          });
        });
      });
  });
  test("status: 400 for an invalid type of article_id", () => {
    return request(app)
      .get("/api/articles/abc/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request!");
      });
  });
  test("status: 404 for an article_id that does not exist in the database", () => {
    return request(app)
      .get("/api/articles/5000/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found!");
      });
  });
  test("status: 200 for an article_id that exists but has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual([]);
        expect(body).toBeInstanceOf(Array);
        expect(body).toHaveLength(0);
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
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
      .delete("/api/comments/abc")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request, invalid id!");
      });
  });
});

describe("GET /api", () => {
  test("status:200, responds with a json object of all available endpoints of the API", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const routes = body;
        expect(routes).toBeInstanceOf(Object);
        expect(routes).toEqual(endpoints);
      });
  });
});
