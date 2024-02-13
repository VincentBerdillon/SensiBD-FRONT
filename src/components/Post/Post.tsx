import * as React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DangerousIcon from '@mui/icons-material/Dangerous';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { useState } from 'react';
import { useAppSelector } from '../../hooks/redux';
import { Post as TPost } from '../../@types/post';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

// Flèche d'agrandissent des informations de la carte: https://mui.com/material-ui/react-card/
const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

//* Composant Post

// typage des propriété d'un Post
type PostProps = {
  post: TPost;
};

export default function Post({ post }: PostProps) {
  const [expanded, setExpanded] = useState(false);
  const isLogged = useAppSelector((state) => state.user.isLogged);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  // Formatage du timeStamp create_at en format nombre de jour depuis la parution, format France
  const formattedDate = formatDistanceToNow(new Date(post.created_at), {
    locale: fr,
    addSuffix: true,
  });

  // Au clic sur l'icone de chat, redirection vers la page de discussion avec une route dynamique (id du post et id de celui qui a posté)
  const handleRedirectToMessagesPage = () => {
    window.location.replace(`/messages/${post.id}/${post.user_id}`);
  };

  return (
    <div className="post">
      <Card sx={{ width: 300 }}>
        <CardHeader
          avatar={
            <Avatar
              alt="User Avatar"
              src={post.avatar}
              sx={{ bgcolor: red[500] }}
            >
              {post.pseudonym.charAt(0).toUpperCase()}
            </Avatar>
          }
          action={
            <IconButton
              aria-label="Contacter"
              disabled={!isLogged}
              onClick={handleRedirectToMessagesPage}
            >
              <ChatBubbleIcon />
            </IconButton>
          }
          title={post.pseudonym}
          subheader={formattedDate}
        />

        <CardMedia
          component="img"
          height="250"
          image={post.image}
          alt="photo de l'ouvrage"
          style={{ objectFit: 'cover', width: '100%' }}
        />

        <CardHeader title={post.post_title} subheader="50km" />

        <CardActions disableSpacing>
          <>
            <IconButton aria-label="add to favorites" disabled={!isLogged}>
              <FavoriteIcon />
            </IconButton>
            <IconButton aria-label="Signaler l'annonce" disabled={!isLogged}>
              <DangerousIcon />
            </IconButton>
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon sx={{ color: '#555' }} />
            </ExpandMore>
          </>
        </CardActions>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography paragraph>{post.book_title}</Typography>
            <Typography paragraph>{post.book_author}</Typography>
            <Typography>Description</Typography>
            <Typography>{post.description}</Typography>
          </CardContent>
        </Collapse>
      </Card>
    </div>
  );
}
