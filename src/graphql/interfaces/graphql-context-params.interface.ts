export interface GraphQLContextParams {
  req: GraphQLRequest;
  res?: unknown;
}

export interface GraphQLRequest {
  headers: GraphQLHeaders;
  body?: unknown;
  method?: string;
  url?: string;
  [key: string]: unknown;
}

export interface GraphQLHeaders {
  authorization?: string;
  'content-type'?: string;
  'user-agent'?: string;
  [key: string]: string | string[] | undefined;
}
