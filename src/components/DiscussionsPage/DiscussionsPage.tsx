import React, { useEffect } from 'react';
import { formatRelative } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchDiscussions } from '../../store/reducers/discussions';
import './Discussion.scss';

//* Composant page affichant les discussions en cours

function DiscussionsPage() {
  const dispatch = useAppDispatch();
  const myID = useAppSelector((state) => state.user.userId);
  const discussions = useAppSelector(
    (state) => state.discussions.discussionsList
  );

  useEffect(() => {
    // Émission de l'intention de récupérer les discussions
    dispatch(fetchDiscussions());
  }, []);

  // Formatage de la date
  const formatTimestampRelative = (timestamp: Date) => {
    return formatRelative(new Date(timestamp), new Date(), { locale: fr });
  };

  return (
    <div>
      <div className="discussionsContainer">
        <h2 className="discussionsContainer__title">Messages</h2>
        <ul>
          {discussions.map((discussion) => {
            return (
              <li
                className="discussionsContainer__list-item"
                key={discussion.post_id}
              >
                <div className="discussionsContainer__list-item-title">
                  <Link
                    to={
                      discussion.receiver_id === myID
                        ? `/messages/${discussion.post_id}/${discussion.sender_id}`
                        : `/messages/${discussion.post_id}/${discussion.receiver_id}`
                    }
                  >
                    {discussion.post_title}
                  </Link>
                </div>
                <div className="discussionsContainer__list-item-date">
                  {formatTimestampRelative(discussion.last_message_time)}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default DiscussionsPage;
