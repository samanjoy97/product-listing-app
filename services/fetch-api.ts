import { BASE_URL } from "./query-urls";

interface APIOptions extends RequestInit {
  headers?: Record<string, string>;
}

async function request<T>(
  method: string,
  endpoint: string,
  options: APIOptions = {}
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    method,
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer Dhruba14`, // ! After testing, remove this hardcoded token
      ...options.headers,
    },
  });
  return response.json();
}

async function mediaRequest<T>(
  method: string,
  endpoint: string,
  body: FormData,
  options: APIOptions = {}
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    method,
    headers: {
      ...options.headers,
    },
    body,
  });

  if (!response.ok) {
    const errorResponse = await response.json().catch(() => null);
    const errorMessage =
      errorResponse?.message ?? `HTTP error! status: ${response.status}`;
    throw new Error(errorMessage);
  }

  return response.json();
}

interface GetAndDeleteAPIParams {
  endpoint: string;
  options?: APIOptions;
}

interface PostPutAndPatchAPIParams extends GetAndDeleteAPIParams {
  body: unknown;
}

export interface MediaPostApiParams extends GetAndDeleteAPIParams {
  formData: FormData;
}

const fetchAPI = {
  get: <T>({ endpoint, options = {} }: GetAndDeleteAPIParams) =>
    request<T>("GET", endpoint, options),
  post: <T>({ endpoint, body, options = {} }: PostPutAndPatchAPIParams) =>
    request<T>("POST", endpoint, {
      ...options,
      body: JSON.stringify(body),
    }),
  put: <T>({ endpoint, body, options = {} }: PostPutAndPatchAPIParams) =>
    request<T>("PUT", endpoint, {
      ...options,
      body: JSON.stringify(body),
    }),
  delete: <T>({ endpoint, options = {} }: GetAndDeleteAPIParams) =>
    request<T>("DELETE", endpoint, options),
  patch: <T>({ endpoint, body, options = {} }: PostPutAndPatchAPIParams) =>
    request<T>("PATCH", endpoint, {
      ...options,
      body: JSON.stringify(body),
    }),
  mediaUpload: <T>({ endpoint, formData, options = {} }: MediaPostApiParams) =>
    mediaRequest<T>("POST", endpoint, formData, options),
};

export default fetchAPI;
