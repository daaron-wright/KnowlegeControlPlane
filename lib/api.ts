/**
 * API utility functions for interacting with the Omnis backend
 */

// Default API URL from environment with fallback
const API_URL =
  process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8080";

// Interface for query response
interface QueryResponse {
  workflow?: any;
  error?: string;
  message?: string;
}

/**
 * Process a natural language query through the Omnis backend
 *
 * @param query The natural language query to process
 * @param execute Whether to execute the workflow or just generate it
 * @param outputFormat The format to return the result in (json, yaml, dag)
 * @returns The response from the Omnis backend
 */
export async function processQuery(
  query: string,
  execute: boolean = false,
  outputFormat: string = "json"
): Promise<QueryResponse> {
  try {
    console.log(`Sending query to ${API_URL}/omnis/process`);

    const response = await fetch(`${API_URL}/omnis/process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        execute,
        output_format: outputFormat,
        user_id: "frontend-user", // This could be replaced with actual user ID from auth
        metadata: {
          source: "omnis-ui",
          timestamp: new Date().toISOString(),
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.detail ||
        `API error: ${response.status} ${response.statusText}`;
      console.error("Error processing query:", errorMessage);
      return { error: errorMessage };
    }

    const data = await response.json();
    console.log("Query processed successfully:", data);
    return data;
  } catch (error) {
    console.error("Error processing query:", error);
    return {
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Process a natural language query with streaming response
 *
 * @param query The natural language query to process
 * @param execute Whether to execute the workflow or just generate it
 * @param onChunk Callback function that receives each chunk of the stream
 * @param onError Callback function that handles errors
 * @param onComplete Callback function called when streaming is complete
 */
export async function processStreamQuery(
  query: string,
  execute: boolean = false,
  onChunk: (chunk: string) => void,
  onError: (error: string) => void,
  onComplete: () => void
): Promise<void> {
  try {
    console.log(`Sending streaming query to ${API_URL}/omnis/process/stream`);

    const response = await fetch(`${API_URL}/omnis/process/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        execute,
        user_id: "frontend-user",
        metadata: {
          source: "omnis-ui",
          timestamp: new Date().toISOString(),
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.detail ||
        `API error: ${response.status} ${response.statusText}`;
      console.error("Error processing streaming query:", errorMessage);
      onError(errorMessage);
      return;
    }

    if (!response.body) {
      onError("Response body is null");
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let completeResponse = "";

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        completeResponse += chunk;
        onChunk(chunk);
      }

      console.log("Stream completed successfully");
      onComplete();
    } catch (error) {
      console.error("Error reading stream:", error);
      onError(error instanceof Error ? error.message : "Error reading stream");
    }
  } catch (error) {
    console.error("Error setting up streaming query:", error);
    onError(error instanceof Error ? error.message : "Unknown error occurred");
  }
}
