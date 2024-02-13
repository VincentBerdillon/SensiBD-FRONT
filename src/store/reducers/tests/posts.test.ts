import { describe, expect, it } from 'vitest';
import postsReducer, { fetchPosts, setSearchText } from '../posts';

// Suite de tests pour le reducer posts.ts :

// je veux tester que le reducer retourne bien un state initial isLoading=true

describe('posts reducer', () => {
  it('should have initial isLoading state to true', () => {
    // j'execute mon reducer avec un state undefined et une action vide pour récupérer le state initial
    const state = postsReducer(undefined, { type: '@@Init' });

    // je m'attends à isLoading=true
    expect(state.isLoading).toBe(true);
  });
  // je veux tester que le reducer retourne bien un state initial list=[]
  it('should have initial posts list state to empty array', () => {
    const state = postsReducer(undefined, { type: '@@Init' });

    // je m'attends à list=[]
    expect(state.list).toEqual([]);
  });
  it('should have initial searchText state to empty string', () => {
    const state = postsReducer(undefined, { type: '@@Init' });

    // je m'attends à searchText=''
    expect(state.searchText).toEqual('');
  });
  it('should have initial currentPage state to be equal 1', () => {
    const state = postsReducer(undefined, { type: '@@Init' });

    // je m'attends à currentPage=1
    expect(state.currentPage).toEqual(1);
  });
  // fetch test
  it('should set isLoading to true when fetching posts', () => {
    const currentState = {
      isLoading: false,
      list: [],
      searchText: '',
      currentPage: 1,
    };
    const newState = postsReducer(currentState, fetchPosts.pending);

    expect(newState.isLoading).toBe(true);
  });
  it('should set isLoading to false when fetching posts rejected', () => {
    const currentState = {
      isLoading: false,
      list: [],
      searchText: '',
      currentPage: 1,
    };
    const newState = postsReducer(currentState, fetchPosts.rejected);

    expect(newState.isLoading).toBe(false);
  });

  it('should set search text', () => {
    const state = postsReducer(undefined, setSearchText('example'));

    expect(state.searchText).toEqual('example');
  });
  it('should update state after fetching posts successfully', () => {
    const currentState = {
      isLoading: false,
      list: [],
      searchText: '',
      currentPage: 1,
    };

    const action = {
      type: fetchPosts.fulfilled.type,
      payload: [
        { id: 1, title: 'Post 1' },
        { id: 2, title: 'Post 2' },
      ],
    };

    const newState = postsReducer(currentState, action);

    expect(newState.list).toEqual([...currentState.list, ...action.payload]);
    expect(newState.isLoading).toBe(false);
    expect(newState.currentPage).toBe(currentState.currentPage + 1);
  });
});
