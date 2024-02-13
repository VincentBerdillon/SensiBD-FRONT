import { useEffect } from 'react';
import Post from '../Post/Post';

import { Post as TPost } from '../../@types/post';
import './Posts.scss';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchPosts } from '../../store/reducers/posts';

type PostsProps = {
  posts: TPost[];
};

function Posts() {
  const dispatch = useAppDispatch();
  const posts = useAppSelector((state) => state.posts.list);
  const isLoading = useAppSelector((state) => state.posts.isLoading);
  const currentPage = useAppSelector((state) => state.posts.currentPage);

  useEffect(() => {
    dispatch(fetchPosts(1)); // Chargement initial, page 1
  }, []);

  const handleScroll = (event) => {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight && !isLoading) {
      dispatch(fetchPosts(currentPage));
    }
  };

  return (
    <div className="posts" onScroll={handleScroll}>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
}

export default Posts;
