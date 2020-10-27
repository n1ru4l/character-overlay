export type None = null | undefined;
export type Some<T> = Exclude<T, None>;
export type Maybe<T> = T | None;
export const isSome = <T>(input: T): input is Some<T> => input != null;
export const isNone = (input: unknown): input is None => input == null;
