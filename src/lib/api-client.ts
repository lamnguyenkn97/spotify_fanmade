/**
 * API Client - Centralized fetch wrapper with error handling
 * Replaces raw fetch calls throughout the application
 */

// ============================================================================
// Types
// ============================================================================

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: ApiError;
  status: number;
}

export interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

// ============================================================================
// Base API Client
// ============================================================================

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  /**
   * Build URL with query parameters
   */
  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(endpoint, this.baseUrl || window.location.origin);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    
    return url.toString();
  }

  /**
   * Generic request method
   */
  private async request<T = any>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const { params, ...fetchConfig } = config;
    const url = this.buildUrl(endpoint, params);

    // Default headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...config.headers,
    };

    try {
      const response = await fetch(url, {
        ...fetchConfig,
        headers,
      });

      // Handle non-JSON responses (e.g., redirects, empty responses)
      const contentType = response.headers.get('content-type');
      const isJson = contentType?.includes('application/json');

      let data: any;
      if (isJson && response.ok) {
        data = await response.json();
      } else if (isJson && !response.ok) {
        // Try to parse error response
        try {
          const errorData = await response.json();
          throw {
            message: errorData.error || errorData.message || 'Request failed',
            status: response.status,
            code: errorData.code,
          } as ApiError;
        } catch (parseError) {
          throw {
            message: `Request failed with status ${response.status}`,
            status: response.status,
          } as ApiError;
        }
      } else if (!response.ok) {
        throw {
          message: `Request failed with status ${response.status}`,
          status: response.status,
        } as ApiError;
      }

      return data as T;
    } catch (error) {
      // Network errors or other exceptions
      if ((error as ApiError).status) {
        throw error; // Re-throw API errors
      }
      
      throw {
        message: error instanceof Error ? error.message : 'Network error',
        status: 0,
      } as ApiError;
    }
  }

  /**
   * GET request
   */
  async get<T = any>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T = any>(
    endpoint: string,
    body?: any,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T = any>(
    endpoint: string,
    body?: any,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T = any>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  /**
   * PATCH request
   */
  async patch<T = any>(
    endpoint: string,
    body?: any,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }
}

// ============================================================================
// Export singleton instance
// ============================================================================

export const apiClient = new ApiClient();

// ============================================================================
// SWR Fetcher - for use with SWR hooks
// ============================================================================

/**
 * Generic SWR fetcher
 */
export const swrFetcher = async <T = any>(url: string): Promise<T> => {
  return apiClient.get<T>(url);
};

/**
 * SWR fetcher with params
 */
export const swrFetcherWithParams = async <T = any>(
  [url, params]: [string, Record<string, any>]
): Promise<T> => {
  return apiClient.get<T>(url, { params });
};

