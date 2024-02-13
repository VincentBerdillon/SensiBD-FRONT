import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../utils/axios';
import { Discussion as TDiscussion } from '../../@types/discussion';

// Typage des données
type DiscussionsState = {
  isLoading: boolean;
  discussionsList: TDiscussion[];
};

//* données initiales
const initialState: DiscussionsState = {
  isLoading: false,
  discussionsList: [],
};

// Créer une action asynchrone pour récupérer les messages
export const fetchDiscussions = createAsyncThunk(
  'chat/fetchDiscussions',
  async () => {
    const response = await axiosInstance.get<TDiscussion[]>(
      `/messages/conversations`
    );
    console.log(response.data);
    return response.data;
  }
);

//* Création d'une slice pour gérer les discussions

const discussionsSlice = createSlice({
  name: 'discussions',
  initialState,
  reducers: {
    setDiscussionsList: (state, action) => {
      state.discussionsList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiscussions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDiscussions.fulfilled, (state, action) => {
        state.discussionsList = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchDiscussions.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setDiscussionsList } = discussionsSlice.actions;
export const discussionsReducer = discussionsSlice.reducer;
