import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const backendAPI = 'http://localhost:5005';

const initialState = {
  contacts: [],
  loading: false,
  error: null,
  isSuccess: false,
  isError: false,
};

// Async Thunks
export const fetchContacts = createAsyncThunk('contacts/fetchContacts', async () => {
  try {
    const response = await axios.get(`${backendAPI}/contacts/getAll`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
});

export const fetchContactById = createAsyncThunk('contacts/fetchContactById', async (id) => {
  try {
    const response = await axios.get(`${backendAPI}/contacts/getById/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
});

export const createContact = createAsyncThunk('contacts/createContact', async (newContact) => {
  try {
    const response = await axios.post(`${backendAPI}/contacts/create`, newContact);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
});

export const editContact = createAsyncThunk('contacts/editContact', async ({ id, updatedContact }) => {
  try {
    const response = await axios.put(`${backendAPI}/contacts/edit/${id}`, updatedContact);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
});

export const deleteContact = createAsyncThunk('contacts/deleteContact', async (id) => {
  try {
    await axios.delete(`${backendAPI}/contacts/delete/${id}`);
    return id; // Return the deleted contact id for updating state locally
  } catch (error) {
    throw error.response.data;
  }
});

// Slice definition
const contactSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    resetContacts: (state) => {
      state.isSuccess = false;
      state.isError = false;
    },
    updateContacts: (state, action) => {
      state.contacts = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload || [];
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchContactById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContactById.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = [action.payload]; // Assuming the fetched data is an object with contact details
      })
      .addCase(fetchContactById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createContact.fulfilled, (state) => {
        state.loading = false;
        state.isSuccess = true;
      })
      .addCase(createContact.rejected, (state, action) => {
        state.loading = false;
        state.isError = true;
        state.error = action.error.message;
      })
      .addCase(editContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editContact.fulfilled, (state) => {
        state.loading = false;
        state.isSuccess = true;
      })
      .addCase(editContact.rejected, (state, action) => {
        state.loading = false;
        state.isError = true;
        state.error = action.error.message;
      })
      .addCase(deleteContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.contacts = state.contacts.filter(contact => contact._id !== action.payload);
      })
      .addCase(deleteContact.rejected, (state, action) => {
        state.loading = false;
        state.isError = true;
        state.error = action.error.message;
      });
  },
});

// Export actions and selectors
export const { resetContacts, updateContacts } = contactSlice.actions;

export const selectContacts = (state) => state.contacts.contacts;
export const selectContactsLoading = (state) => state.contacts.loading;

export default contactSlice.reducer;