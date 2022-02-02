/**
 * Class holding constants for interface constants mainly used for Dependency Injection
 */
export class InterfaceConstants {
  /**
   * Interface Constant for injecting logger
   */
  public static readonly LOGGER = 'ILogger';

  /**
   * Interface Constant for injecting HttpAdapterHost
   */
  public static readonly HTTP_REF = 'IHttpAdapterHost';

  /**
   * Interface Constant for injecting GenericExceptionFilter
   */
  public static readonly EXCEPTION_FILTER = 'IExceptionFilter';
}
