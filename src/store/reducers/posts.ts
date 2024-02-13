import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { Post as TPost } from '../../@types/post';

// typage du composant post
type PostsState = {
  isLoading: boolean;
  list: TPost[];
  searchText: string;
  currentPage: number;
};

//* données initiales
const initialState: PostsState = {
  isLoading: true,
  list: [],
  searchText: '',
  currentPage: 1,
};

// fonction de récupération des données de l'API
export const fetchPosts = createAsyncThunk(
  'posts/fetch',
  async (page: number) => {
    const { data } = await axios.get<TPost[]>(
      `http://localhost:3000/posts?page=${page}&pageSize=10`
    );
    return data;
  }
);

//* Création d'une slice pour gérer les posts

const postsReducer = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setSearchText: (state, action) => {
      state.searchText = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.list = [...state.list, ...action.payload];
        state.isLoading = false;
        state.currentPage += 1;
      })
      .addCase(fetchPosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPosts.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setSearchText } = postsReducer.actions;
export default postsReducer.reducer;
