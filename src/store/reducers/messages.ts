import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Message as TMessage } from '../../@types/message';
import { axiosInstance } from '../../utils/axios';

// typage des données
type MessagesState = {
  isLoading: boolean;
  messagesList: TMessage[];
};

//* Données initiales
const initialState: MessagesState = {
  isLoading: false,
  messagesList: [],
};

// Fonction asynchrone pour récupérer les messages
export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async ({
    postId,
    userId,
  }: {
    postId: string | undefined;
    userId: string | undefined;
  }) => {
    const response = await axiosInstance.get<TMessage[]>(
      `/messages/${postId}/${userId}`
    );
    return response.data;
  }
);
// Fonction asynchrone pour envoyer un message
export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async ({
    postId,
    userId,
    messageContent,
  }: {
    postId: string | undefined;
    userId: string | undefined;
    messageContent: string;
  }) => {
    const response = await axiosInstance.post(`/messages/${postId}/${userId}`, {
      content: messageContent,
    });
    return response.data;
  }
);

//* Création d'une slice pour gérer le chat

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messagesList = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchMessages.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const messagesReducer = messagesSlice.reducer;
