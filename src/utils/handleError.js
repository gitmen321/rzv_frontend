/**
 * Centralized error handler
 * @param {Error|Response} error 
 * @returns {string} Formatted error message
 */
export const handleError = async (error) => {
  if (error instanceof Response) {
    if (error.status === 429) {
      return "Too many requests, Please try again later";
    }
    
    try {
      const data = await error.json();
      return data.message || `API Error: ${error.statusText}`;
    } catch (e) {
      return `API Error: ${error.statusText}`;
    }
  }

  // Handle generic errors
  return error?.message || "An unexpected error occurred. Please try again.";
};
