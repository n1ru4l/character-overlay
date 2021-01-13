import type { Database } from "better-sqlite3";
import { toCamelCase } from "./util/toCamelCase";
import { toSnakeCase } from "./util/toSnakeCase";

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
    key = toCamelCase(key);
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
        "created_at",
        "name",
        "image_url",
        "maximum_health",
        "current_health",
        "has_mana",
        "maximum_mana",
        "current_mana",
        "edit_hash",
        "has_fate_points",
        "maximum_fate_points",
        "current_fate_points"
      FROM
        "character"
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
        "created_at",
        "name",
        "image_url",
        "maximum_health",
        "current_health",
        "has_mana",
        "maximum_mana",
        "current_mana",
        "edit_hash",
        "has_fate_points",
        "maximum_fate_points",
        "current_fate_points"
      FROM
        "character"
      WHERE
        "edit_hash" = ?
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
    setParts.push(`${toSnakeCase(key)} = ?`);
  }
  db.prepare(
    /* SQL */ `
    UPDATE
      "character"
    SET ${setParts.join(", ")}
    WHERE
      "edit_hash" = ?
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
    INSERT INTO "character" ("id", "name", "image_url", "edit_hash") VALUES (
      ?,
      ?,
      ?,
      ?
    );
  `
  ).run(opts.id, opts.name, opts.imageUrl, opts.editHash);
};
