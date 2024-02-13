import React, { useEffect, useState } from 'react';
import { formatRelative } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchMessages, sendMessage } from '../../store/reducers/messages';
import './ConversationPage.scss';

//* Composant de la page de conversation entre utilisateurs (chat)

function ConversationPage() {
  const dispatch = useAppDispatch();
  const { postId, userId } = useParams();
  const myID = useAppSelector((state) => state.user.userId);
  const messages = useAppSelector((state) => state.messages.messagesList);
  const [messageContent, setMessageContent] = useState('');

  useEffect(() => {
    // Emission de l'intention de récupérer les messages
    dispatch(fetchMessages({ postId, userId }));
  }, [dispatch, postId, userId]);

  // Formatage de la date
  const formatTimestampRelative = (timestamp: Date) => {
    return formatRelative(new Date(timestamp), new Date(), { locale: fr });
  };

  const handleSendClick = () => {
    // Vérification que le messageContent n'est pas vide avant de l'envoyer
    if (messageContent.trim() !== '') {
      dispatch(sendMessage({ postId, userId, messageContent }));
      console.log('🚀 ~ messageContent:', messageContent);
      setMessageContent(''); // Réinitialiser le champ après l'envoi
      window.location.reload();
    }
  };
  return (
    <div>
      <div className="messagesContainer">
        <h2 className="messagesContainer__title">Conversation</h2>
        <ul className="messagesContainer__list">
          {messages.map((message) => {
            return (
              <li
                key={message.id}
                className={
                  message.sender_id === myID
                    ? 'myMessage'
                    : 'interlocutorMessage'
                }
              >
                {/* Afficher l'auteur du message */}
                <div className="messagesContainer__list-Header">
                  {message.sender_id === myID ? 'Moi' : ` ${message.pseudonym}`}
                </div>
                <div className="messagesContainer__list-date">
                  {formatTimestampRelative(message.created_at)}
                </div>
                {/* Afficher le contenu du message */}
                <div className="messagesContainer__list-content">
                  {message.content}
                </div>
              </li>
            );
          })}
        </ul>
        <div className="inputContainer">
          <input
            type="text"
            value={messageContent}
            onChange={(event) => setMessageContent(event.target.value)}
          />
          <button type="submit" onClick={handleSendClick}>
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConversationPage;
