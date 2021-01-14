import type { Database } from "better-sqlite3";

export type CharacterRecord = {
  id: string;
  createdAt: Date;
  name: string;
  imageUrl: string;
  maximumHealth: number;
  currentHealth: number;
  hasMana: boolean;
  maximumMana: number;
  currentMana: number;
  editHash: string;
  hasFatePoints: boolean;
  maximumFatePoints: number;
  currentFatePoints: number;
};

const transformRecord = (record: {
  [key: string]: unknown;
}): CharacterRecord | null => {
  if (!record) {
    return null;
  }
  const entries = Object.entries(record);
  const newEntries: [string, unknown][] = [];
  for (let [key, value] of entries) {
    if (key === "hasMana" || key === "hasFatePoints") {
      value = value ? true : false;
    }
    newEntries.push([key, value]);
  }

  return Object.fromEntries(newEntries) as CharacterRecord;
};

export const findOneWhereId = (id: string) => (
  db: Database
) => (): null | CharacterRecord => {
  const maybeRecord = db
    .prepare(
      /* SQL */ `
      SELECT
        "id",
        "createdAt",
        "name",
        "imageUrl",
        "maximumHealth",
        "currentHealth",
        "hasMana",
        "maximumMana",
        "currentMana",
        "editHash",
        "hasFatePoints",
        "maximumFatePoints",
        "currentFatePoints"
      FROM
        "Character"
      WHERE
        "id" = ?
    `
    )
    .get(id);

  return transformRecord(maybeRecord);
};

export const findOneWhereEditHash = (editHash: string) => (
  db: Database
) => (): null | CharacterRecord => {
  const maybeRecord = db
    .prepare(
      /* SQL */ `
      SELECT
        "id",
        "createdAt",
        "name",
        "imageUrl",
        "maximumHealth",
        "currentHealth",
        "hasMana",
        "maximumMana",
        "currentMana",
        "editHash",
        "hasFatePoints",
        "maximumFatePoints",
        "currentFatePoints"
      FROM
        "Character"
      WHERE
        "editHash" = ?
    `
    )
    .get(editHash);

  return transformRecord(maybeRecord);
};

export const updateOneWhereEditHash = (
  editHash: string,
  options: {
    id?: string | undefined;
    name?: string | undefined;
    imageUrl?: string | undefined;
    maximumHealth?: number | undefined;
    currentHealth?: number | undefined;
    hasMana?: boolean | undefined;
    maximumMana?: number | undefined;
    currentMana?: number | undefined;
    hasFatePoints?: boolean | undefined;
    maximumFatePoints?: number | undefined;
    currentFatePoints?: number | undefined;
  }
) => (db: Database) => (): void => {
  const changedOptions = Object.entries(options);
  if (changedOptions.length === 0) {
    return;
  }
  const values: Array<unknown> = [];
  let setParts: Array<string> = [];
  for (let [key, value] of changedOptions) {
    if (value === undefined) {
      continue;
    }
    if (typeof value === "boolean") {
      value = value ? 1 : 0;
    }
    values.push(value);
    setParts.push(`"${key}" = ?`);
  }
  db.prepare(
    /* SQL */ `
    UPDATE
      "Character"
    SET ${setParts.join(", ")}
    WHERE
      "editHash" = ?
  `
  ).run(...values, editHash);
};

export const createOne = (opts: {
  id: string;
  name: string;
  imageUrl: string;
  editHash: string;
}) => (db: Database) => (): void => {
  db.prepare(
    /* SQL*/ `
    INSERT INTO "Character" ("id", "name", "imageUrl", "editHash") VALUES (
      ?,
      ?,
      ?,
      ?
    );
  `
  ).run(opts.id, opts.name, opts.imageUrl, opts.editHash);
};
