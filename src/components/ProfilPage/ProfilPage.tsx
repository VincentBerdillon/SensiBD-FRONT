import React, { FormEvent, useEffect, useState } from 'react';
import axios from 'axios';

import {
  Typography,
  Avatar,
  IconButton,
  TextField,
  Button,
  Grid,
  Box,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';
import { handleLogout } from '../../store/reducers/user';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { axiosInstance } from '../../utils/axios';
import convertImageFile from '../../utils/convertImageFile';

interface UserData {
  firstname: string;
  lastname: string;
  pseudonym: string;
  email: string;
  postedAds?: number;
  address: string;
  score?: number;
}
interface EditableFieldProps {
  label: string;
  value: string;
  onSave: (value: string) => void;
}
interface ImageUploadResult {
  location: string;
}
interface PostImageParams {
  image?: File | null;
  description: string;
  avatarSrc?: string;
}

function EditableField({ label, value, onSave }: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [fieldValue, setFieldValue] = useState(value);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    onSave(fieldValue);
    setIsEditing(false);
  };

  return (
    <Grid item xs={12} md={6}>
      <Typography variant="subtitle1">{label}</Typography>
      {isEditing ? (
        <div style={{ display: 'flex' }}>
          <TextField
            fullWidth
            value={fieldValue}
            onChange={(e) => setFieldValue(e.target.value)}
          />
          <IconButton onClick={handleSaveClick}>
            <EditIcon />
          </IconButton>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Typography>{value}</Typography>
          <IconButton onClick={handleEditClick}>
            <EditIcon />
          </IconButton>
        </div>
      )}
    </Grid>
  );
}

async function postImage({ image, description }: PostImageParams) {
  const formData = new FormData();

  if (image) {
    formData.append('image', image);
  }
  formData.append('description', description);

  if (image) {
    try {
      const result = await axios.post<ImageUploadResult>(
        'http://localhost:3000/images',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      console.log(result.data);

      return result.data;
    } catch (error) {
      console.error('Error uploading the image', error);
      throw error;
    }
  } else {
    return null;
  }
}

function UserProfilePage() {
  const [userData, setUserData] = useState<UserData>({
    firstname: '',
    lastname: '',
    pseudonym: '',
    email: '',
    postedAds: undefined,
    address: '',
    score: undefined,
  });
  const [avatarSrc, setAvatarSrc] = useState('/path/to/avatar.jpg');
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.user.userId);

  useEffect(() => {
    axiosInstance
      .get(`http://localhost:3000/users/${userId}`)
      .then((response) => {
        console.log('Data received:', response.data[0]);
        const { firstname, lastname, pseudonym, email, address, score } =
          response.data[0];
        console.log(firstname, lastname, pseudonym, email, address, score);

        setUserData((prevData) => ({
          ...prevData,
          firstname,
          lastname,
          pseudonym,
          email,
          address,
          score,
        }));
      })
      .catch((error) => {
        console.log(error);
      });
  }, [userId]);

  const handleInputChange = (field: string, value: string) => {
    setUserData((prevData) => ({ ...prevData, [field]: value }));
  };
  const handleSaveClick = async (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      const result = await postImage({ image: file, description });
      const imageUrl: string | undefined = result?.location;

      if (imageUrl) {
        setImages([imageUrl, ...images]);
      }
    } catch (error) {
      console.error("Erreur lors de l'upload de l'image", error);
    }
    console.log('newInfo', userData);
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const imageFile: FileList | null = event.target.files;
    if (imageFile?.length) {
      const imageBlob = await convertImageFile(imageFile[0]);
      setFile(imageFile[0]);
      // Change l' URL de l'avatar dynamiquement
      setAvatarSrc(URL.createObjectURL(imageBlob as Blob));
    }

    console.log('Uploaded file:', file);
  };
  const handleDisconnect = () => {
    dispatch(handleLogout());
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      <div
        style={{
          padding: '1rem',
        }}
      >
        <input
          type="file"
          accept="image/*"
          id="image-upload"
          style={{ display: 'none' }}
          onChange={handleImageUpload}
        />
        <label htmlFor="image-upload">
          <Avatar
            alt="User Avatar"
            src={avatarSrc}
            sx={{
              width: 100,
              height: 100,
              marginBottom: 2,
              margin: 'auto',
              cursor: 'pointer',
            }}
          />
        </label>
        <div style={{ textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            {userData.pseudonym}
          </Typography>
          <Typography>Crédits: {userData.score}</Typography>
        </div>
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Récapitulatif des informations
          </Typography>
          <Typography>Prénom: {userData.firstname}</Typography>
          <Typography>Nom: {userData.lastname}</Typography>
          <Typography>Pseudo: {userData.pseudonym}</Typography>
          <Typography>Email: {userData.email}</Typography>
          <Typography>Addresse: {userData.address}</Typography>
        </div>
        <Grid container spacing={2} style={{ marginTop: 16 }}>
          <EditableField
            label="Prénom"
            value={userData.firstname}
            onSave={(value: string) => handleInputChange('firstname', value)}
          />
          <EditableField
            label="Nom"
            value={userData.lastname}
            onSave={(value: string) => handleInputChange('lastname', value)}
          />
          <EditableField
            label="Pseudo"
            value={userData.pseudonym}
            onSave={(value: string) => handleInputChange('pseudonym', value)}
          />
          <EditableField
            label="Adresse email"
            value={userData.email}
            onSave={(value: string) => handleInputChange('email', value)}
          />
          <EditableField
            label="Adresse"
            value={userData.address}
            onSave={(value: string) => handleInputChange('address', value)}
          />
        </Grid>

        <div
          style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}
        >
          <Button
            variant="contained"
            sx={{
              mb: 1,
              backgroundColor: '#95C23D',
              '&:hover': {
                backgroundColor: '#7E9D2D',
              },
            }}
            onClick={handleSaveClick}
          >
            Enregistrer les modifications
          </Button>
        </div>
        <div
          style={{
            marginTop: '0.5rem',
            textAlign: 'center',
            marginBottom: '4.5rem',
          }}
        >
          <Link to="/myPosts">Mes annonces</Link>
          <span style={{ margin: '0 8px' }}>|</span>
          <Link to="/mes-favoris">Mes favoris</Link>
          <span style={{ margin: '0 8px' }}>|</span>
          <Link to="/" onClick={handleDisconnect}>
            Me déconnecter
          </Link>
        </div>
      </div>
    </Box>
  );
}

export default UserProfilePage;
