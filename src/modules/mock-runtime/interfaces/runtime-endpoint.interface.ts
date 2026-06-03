export interface RuntimeEndpoint {
  endpointId: number;
  statusCode: number;
  delay: number;
  responseBody: unknown;
}
