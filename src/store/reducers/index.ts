import postsReducer from './posts';
import userReducer from './user';
import { messagesReducer } from './messages';
import { discussionsReducer } from './discussions';

const reducer = {
  posts: postsReducer,
  user: userReducer,
  messages: messagesReducer,
  discussions: discussionsReducer,
};

export default reducer;
