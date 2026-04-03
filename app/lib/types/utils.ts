export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type NullableOptional<T> = T | null | undefined;

export type ValueOf<T> = T[keyof T];

export type OmitId<T> = Omit<T, 'id'>;

export type OmitKey<T, K extends keyof T> = Omit<T, K>;

export type OmitIdAnd<
  T extends { id: unknown },
  K extends Exclude<keyof T, 'id'>,
> = Omit<T, 'id' | K>;

export type WithId<T, I = string> = T & { id: I };

export type MaybeArray<T> = T | T[];
export type MaybePromise<T> = T | Promise<T>;
