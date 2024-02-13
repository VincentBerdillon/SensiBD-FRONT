import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import Post from '../Post/Post';
import Loader from '../Loader/Loader';
import './Posts.scss';
import { Post as TPost } from '../../@types/post';
import CustomToast from '../CustomToast/CustomToast';

function Posts() {
  const [items, setItems] = useState<TPost[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [index, setIndex] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);

  // À l'arrivée sur la page, si le tableau de posts est vide, fetch initial
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (items.length === 0) {
          const response = await axios.get(
            `http://localhost:3000/posts?page=${index}&pageSize=10`
          );
          setItems(response.data);
        }
      } catch (error) {
        console.error(error);
        setErrorOpen(true);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMoreData = async () => {
    // Si en chargement ou s'il ne reste plus de posts à fetch, on s'arrête
    if (isLoading || !hasMore) {
      return;
    }
    // Sinon chargement à true et fetch la page suivant (index+1)
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/posts?page=${index + 1}&pageSize=10`
      );
      // si sur la nouvelle page, response.data existe, donc qu'il y a des posts, newData = response.data, sinon égale à un array vide
      const newData = response.data ?? [];
      // puis fusionne le tableau existant avec le tableau des nouveaux posts ou avec un tableau vide si pas de posts
      setItems((prevItems) => prevItems.concat(newData));
      // si la page suivante à des posts, on renvoie true, sinon false
      setHasMore(newData.length > 0);
    } catch (error) {
      console.error(error);
      setErrorOpen(true);
    } finally {
      setIndex((prevIndex) => prevIndex + 1);
      setIsLoading(false);
    }
  };

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    // Vérifier si on a atteint le bas du container visible
    // scrollTop : quantité d'espace vertical déplacé vers le haut depuis le début du documment
    // clientHeight : La hauteur de la zone d'affichage visible du contenu.
    // scrollHeight : La hauteur totale du contenu, y compris la partie qui n'est pas visible en raison du défilement.
    if (scrollHeight - scrollTop <= clientHeight && !isLoading) {
      fetchMoreData();
    }
  };

  return (
    <div>
      <InfiniteScroll
        className="posts"
        dataLength={items.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<Loader />}
        onScroll={handleScroll}
      >
        {items &&
          items.map((item) => (
            <Post
              post={item}
              key={item.id}
              id={item.id}
              user_id={item.user_id}
            />
          ))}
      </InfiniteScroll>
      <CustomToast
        open={errorOpen}
        onClose={() => setErrorOpen(false)}
        severity="error"
      >
        Problème serveur - erreur 500
      </CustomToast>
    </div>
  );
}

export default Posts;
