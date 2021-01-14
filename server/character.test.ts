import Database from "better-sqlite3";
import * as lib from "./character";
import { migrateDatabase } from "./migrateDatabase";

const createDB = () => new Database(":memory:");

describe("character read database logic", () => {
  const db = createDB();
  migrateDatabase(db)();
  db.exec(/* SQL*/ `
    INSERT INTO "character" ("id", "name", "imageUrl", "editHash", "createdAt") VALUES (
      '1',
      'Peter',
      'img',
      'secret',
      '2021-01-08 21:54:10'
    );
  `);

  afterAll(() => {
    db.close();
  });

  test("findOneWhereId: can not load a non existing record", () => {
    const record = lib.findOneWhereId("0")(db)();
    expect(record).toEqual(null);
  });

  test("findOneWhereId: can find a user with a certain id", () => {
    const record = lib.findOneWhereId("1")(db)();
    expect(record).toMatchInlineSnapshot(`
      Object {
        "createdAt": "2021-01-08 21:54:10",
        "currentFatePoints": 2,
        "currentHealth": 30,
        "currentMana": 30,
        "editHash": "secret",
        "hasFatePoints": false,
        "hasMana": false,
        "id": "1",
        "imageUrl": "img",
        "maximumFatePoints": 2,
        "maximumHealth": 30,
        "maximumMana": 30,
        "name": "Peter",
      }
    `);
  });

  test("findOneWhereEditHash: can not load a non existing record", () => {
    const record = lib.findOneWhereId("0")(db)();
    expect(record).toEqual(null);
  });

  test("findOneWhereEditHash: can not load a non existing editHash", () => {
    const record = lib.findOneWhereId("secret")(db)();
    expect(record).toMatchInlineSnapshot(`null`);
  });
});

describe("character update database logic", () => {
  const db = createDB();
  migrateDatabase(db)();
  db.exec(/* SQL*/ `
    INSERT INTO "character" ("id", "name", "imageUrl", "editHash", "createdAt") VALUES (
      '1',
      'Peter',
      'img',
      'secret',
      '2021-01-08 21:54:10'
    );
  `);

  test("updateOneWhereEditHash: can update characters table", () => {
    lib.updateOneWhereEditHash("1", {
      imageUrl: "new",
    })(db)();
  });

  afterAll(() => {
    db.close();
  });
});
