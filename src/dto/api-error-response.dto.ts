/**
 * Api Response model
 */
export class ApiErrorResponse {
  /**
   * High level overview of what error says
   */
  message: string;

  /**
   * The error body stating what & where the error is
   */
  error: unknown;
}
