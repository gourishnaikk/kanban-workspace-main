const API_BASE_URL = 'https://crewboard-workspace.onrender.com/api/users';

/**
 * Register a new user with the Experiment 5 backend
 * @param {Object} userData - { name, email, password }
 * @returns {Promise<Object>} Response object containing user & token or error details
 */
export async function registerUser({ name, email, password }) {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle validation errors from express-validator
      if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
        const errorMessages = data.errors.map((e) => e.message || e.msg).join('. ');
        return {
          success: false,
          status: response.status,
          message: errorMessages || data.message || 'Validation failed',
          errors: data.errors,
        };
      }

      return {
        success: false,
        status: response.status,
        message: data.message || 'Registration failed. Please try again.',
      };
    }

    return {
      success: true,
      status: response.status,
      data,
    };
  } catch (error) {
    return {
      success: false,
      status: 0,
      message: 'Unable to connect to the server. Please ensure the backend is running.',
    };
  }
}

/**
 * Authenticate existing user with the Experiment 5 backend
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>} Response object containing token & user or error details
 */
export async function loginUser({ email, password }) {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
        const errorMessages = data.errors.map((e) => e.message || e.msg).join('. ');
        return {
          success: false,
          status: response.status,
          message: errorMessages || data.message || 'Validation failed',
        };
      }

      return {
        success: false,
        status: response.status,
        message: data.message || 'Invalid email or password.',
      };
    }

    return {
      success: true,
      status: response.status,
      data,
    };
  } catch (error) {
    return {
      success: false,
      status: 0,
      message: 'Unable to connect to the server. Please ensure the backend is running.',
    };
  }
}

/**
 * Fetch authenticated user profile using JWT token
 * @param {string} token - JWT bearer token
 * @returns {Promise<Object>}
 */
export async function getUserProfile(token) {
  try {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        message: data.message || 'Failed to fetch user profile.',
      };
    }

    return {
      success: true,
      status: response.status,
      data,
    };
  } catch (error) {
    return {
      success: false,
      status: 0,
      message: 'Unable to connect to the server.',
    };
  }
}
