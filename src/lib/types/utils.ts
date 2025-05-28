import React from 'react';
export type ReactContextStateType<T, Actions = any> = React.Context<{
  state: T;
  dispatch: React.Dispatch<Actions>;
}>;

export type InferActions<T> = T extends {
  [key: string]: (...args: any[]) => infer U;
}
  ? U
  : never;

export type PaginatedResponse<T = any> = {
  meta: {
    totalDocs: 1;
    totalPages: 1;
    page: 1;
    limit: 20;
    hasNextPage: false;
    hasPrevPage: false;
    nextPage: null;
    prevPage: null;
  };
  data: T[];
};
