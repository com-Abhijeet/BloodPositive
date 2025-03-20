

const API_URL = 'http://192.168.1.17:3000/api/v1/requests';

export const createRequest = async (request: any) => {
  try {
    const response = await fetch(`${API_URL}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ request }),
    });
    const result = await response.json();
    if (response.ok) {
      return { status: response.status, message: result.message };
    } else {
      throw new Error(result.message || 'Failed to create request');
    }
  } catch (error) {
    console.error('Error creating request:', error);
    throw error;
  }
};

export const getUserSentRequests = async (requestorId: string) => {
  try {
    const response = await fetch(`${API_URL}/getUserSentRequests/${requestorId}`);
    const result = await response.json();
    if (response.ok) {
      return result;
    } else {
      throw new Error(result.message || 'Failed to fetch sent requests');
    }
  } catch (error) {
    console.error('Error fetching sent requests:', error);
    throw error;
  }
};

export const getUserReceivedRequests = async (requestedTo: string) => {
  try {
    const response = await fetch(`${API_URL}/getUserRecievedRequest/${requestedTo}`);
    const result = await response.json();
    if (response.ok) {
      return result;
    } else {
      throw new Error(result.message || 'Failed to fetch received requests');
    }
  } catch (error) {
    console.error('Error fetching received requests:', error);
    throw error;
  }
};

export const updateRequest = async (requestId: string, updateData: any) => {
  try {
    const response = await fetch(`${API_URL}/update/${requestId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    const result = await response.json();
    if (response.ok) {
      return { status: response.status, message: result.message, data: result };
    } else {
      throw new Error(result.message || 'Failed to update request');
    }
  } catch (error) {
    console.error('Error updating request:', error);
    throw error;
  }
};

export const deleteRequest = async (requestId: string) => {
  try {
    const response = await fetch(`${API_URL}/delete/${requestId}`, {
      method: 'DELETE',
    });
    const result = await response.json();
    if (response.ok) {
      return { status: response.status, message: result.message };
    } else {
      throw new Error(result.message || 'Failed to delete request');
    }
  } catch (error) {
    console.error('Error deleting request:', error);
    throw error;
  }
};