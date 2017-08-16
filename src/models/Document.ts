type HasId = {_id: string};
export type Document<T> = T & HasId;
