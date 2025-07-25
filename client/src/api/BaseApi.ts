import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
}

export class BaseApi {
  private axiosInstance: AxiosInstance;
  private baseURL: string;

  constructor(
    baseURL: string = process.env.NODE_ENV === "production"
      ? "/api"
      : "http://localhost:3000/api"
  ) {
    this.baseURL = baseURL;
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        console.log(
          `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
        );
        return config;
      },
      (error) => {
        console.error("❌ Request Error:", error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(
          `✅ API Response: ${response.status} ${response.config.url}`
        );
        return response;
      },
      (error) => {
        console.error(
          "❌ Response Error:",
          error.response?.status,
          error.response?.data || error.message
        );

        // Handle different error types
        if (error.response) {
          // Server responded with error status
          const { status, data } = error.response;
          switch (status) {
            case 401:
              console.warn("🔐 Unauthorized access");
              break;
            case 403:
              console.warn("🚫 Forbidden access");
              break;
            case 404:
              console.warn("🔍 Resource not found");
              break;
            case 500:
              console.error("🔥 Internal server error");
              break;
            default:
              console.error(`🚨 HTTP Error ${status}:`, data);
          }
        } else if (error.request) {
          // Request was made but no response received
          console.error("📡 Network Error: No response from server");
        } else {
          // Something else happened
          console.error("⚠️ Request Setup Error:", error.message);
        }

        return Promise.reject(error);
      }
    );
  }

  // GET request
  protected async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.get<T>(url, config);
      return {
        data: response.data,
        success: true,
      };
    } catch (error: any) {
      return this.handleError<T>(error);
    }
  }

  // POST request
  protected async post<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.post<T>(url, data, config);
      return {
        data: response.data,
        success: true,
      };
    } catch (error: any) {
      return this.handleError<T>(error);
    }
  }

  // PUT request
  protected async put<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.put<T>(url, data, config);
      return {
        data: response.data,
        success: true,
      };
    } catch (error: any) {
      return this.handleError<T>(error);
    }
  }

  // DELETE request
  protected async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.delete<T>(url, config);
      return {
        data: response.data,
        success: true,
      };
    } catch (error: any) {
      return this.handleError<T>(error);
    }
  }

  // PATCH request
  protected async patch<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.patch<T>(url, data, config);
      return {
        data: response.data,
        success: true,
      };
    } catch (error: any) {
      return this.handleError<T>(error);
    }
  }

  // Error handler
  private handleError<T>(error: any): ApiResponse<T> {
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";

    return {
      data: null as T,
      success: false,
      message,
    };
  }

  // Root level GET request (outside API prefix)
  protected async getRootLevel<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const rootURL =
        process.env.NODE_ENV === "production" ? "" : "http://localhost:3000";
      const response = await axios.get<T>(`${rootURL}${url}`, {
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
        },
        ...config,
      });
      return {
        data: response.data,
        success: true,
      };
    } catch (error: any) {
      return this.handleError<T>(error);
    }
  }

  // Health check method
  public async healthCheck(): Promise<
    ApiResponse<{ status: string; timestamp: string }>
  > {
    return this.getRootLevel("/health");
  }

  // Get base URL
  public getBaseURL(): string {
    return this.baseURL;
  }

  // Update base URL
  public setBaseURL(newBaseURL: string): void {
    this.baseURL = newBaseURL;
    this.axiosInstance.defaults.baseURL = newBaseURL;
  }

  // Get axios instance for advanced usage
  public getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

export default BaseApi;
