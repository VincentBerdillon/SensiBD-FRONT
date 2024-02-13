import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import { Add as AddIcon } from '@mui/icons-material';
import { axiosInstance } from '../../utils/axios';
import { useAppSelector } from '../../hooks/redux';
import CustomToast from '../CustomToast/CustomToast';

type FormData = {
  post_title: string;
  description: string;
  book_title: string;
  book_author: string;
  image: File | null;
  category_id: number | null;
  audience_id: number | null;
  condition_id: number | null;
  user_id: number | undefined;
  slug: string;
  file: File | null;
};

// fonction pour transformer le titre de l'annonce en slug (tout en minuscule, sans accents, séparé par des tirets, etc.)
const slugify = (text: string) =>
  text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');

// envoie d'une image vers un serveur http
type FileData = { file: File | null };
async function postImage({ file }: FileData) {
  const imgFormData = new FormData();

  if (file) {
    imgFormData.append('image', file);
    const result = await axiosInstance.post(
      'http://localhost:3000/images',
      imgFormData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    console.log('🚀 ~ result:', result);

    return result.data.imagePath;
  }
  return null;
}

//* Composant pour poster une annonce

function AddPostPage() {
  const [formData, setFormData] = useState<FormData>({
    post_title: '',
    description: '',
    book_title: '',
    book_author: '',
    image: null,
    category_id: null,
    audience_id: null,
    condition_id: null,
    slug: '',
    user_id: undefined,
    file: null,
  });
  const userId = useAppSelector((state) => state.user.userId);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);

  // Récupération de l'id de l'utilisateur connecté depuis le store, grâce au token
  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      user_id: userId,
    }));
    console.log('🚀 ~ user_id:', formData.user_id);
  }, [userId]);

  // changement des données du Form en dynamique (field représente la clé du tableau formData)
  const handleInputChange =
    (field: keyof FormData) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prevData) => ({
        ...prevData,
        [field]: event.target.value,
      }));
    };

  // Enregistrement dans le formData et son slug
  const handletitleAndSlugChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const inputValue = event.target.value;
    const inputValueSlug = slugify(inputValue);

    setFormData((prevData) => ({
      ...prevData,
      post_title: event.target.value,
      slug: inputValueSlug,
    }));
  };

  // Enregistrement des valeurs des checkbox (même principe que les inputs mais la clé ici s'appelle category)
  const handleCheckboxChange = (category: keyof FormData, value: number) => {
    setFormData((prevData) => ({
      ...prevData,
      [category]: prevData[category] === value ? '' : value,
    }));
  };

  // Enregistrement de l'image dans le formData dans file
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    console.log(event.target.files);
    setFormData((prevData) => ({
      ...prevData,
      file,
    }));
  };

  // Envoie du FormData
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('🚀 ~ formData:', formData);
    try {
      // Envoi du fichier depuis la fonction postImage + success toast
      const imagePath = await postImage({
        file: formData.file,
      });

      // Post axios avec redirection vers la homepage si réussi
      await axiosInstance
        .post('/posts', {
          ...formData,
          image: imagePath,
        })

        .then((response) => {
          if (response && response.status >= 200 && response.status < 300) {
            console.log('🚀 ~ response:', response);
            setSuccessOpen(true);
            setTimeout(() => {
              window.location.replace('/');
            }, 1500);
          }
        });
    } catch (error) {
      console.warn(error);
      setErrorOpen(true);
    }
  };

  return (
    <div className="postForm" style={{ padding: '1rem' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Publier une Annonce
      </Typography>
      <div style={{ marginBottom: 16 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Titre de l'annonce"
                fullWidth
                required
                value={formData.post_title}
                onChange={handletitleAndSlugChange}
                inputProps={{ maxLength: 50 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description de l'annonce"
                multiline
                rows={4}
                fullWidth
                required
                value={formData.description}
                onChange={handleInputChange('description')}
                inputProps={{ maxLength: 200 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Titre de l'ouvrage"
                multiline
                required
                rows={4}
                fullWidth
                value={formData.book_title}
                onChange={handleInputChange('book_title')}
                inputProps={{ maxLength: 100 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Auteur de l'ouvrage"
                multiline
                required
                rows={4}
                fullWidth
                value={formData.book_author}
                onChange={handleInputChange('book_author')}
                inputProps={{ maxLength: 100 }}
              />
            </Grid>
            <Grid item xs={12}>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                id="photo-upload"
                onChange={handleFileChange}
              />
              <label htmlFor="photo-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<AddIcon />}
                >
                  Ajouter une photo
                </Button>
              </label>
            </Grid>
            {formData.file && (
              <Grid item xs={3}>
                <img
                  src={URL.createObjectURL(formData.file)}
                  alt="votre ouvrage a importer"
                  style={{ width: '100%', height: 'auto', marginBottom: 8 }}
                />
                <IconButton
                  onClick={() =>
                    setFormData((prevData) => ({ ...prevData, file: null }))
                  }
                >
                  <RemoveIcon />
                </IconButton>
              </Grid>
            )}
            <Grid
              item
              sx={{
                // Styles pour les écrans extra petits (xs) à moyens (md)
                '@media (max-width:600px)': {
                  display: 'flex',
                  flexDirection: 'column',
                },
                // Styles pour les écrans larges (lg) et très larges (xl)
                '@media (min-width:1200px)': {
                  display: 'flex',
                  flexDirection: 'row',
                },
              }}
            >
              <div>
                <h3>Catégories</h3>
                <FormGroup style={{ display: 'flex', flexDirection: 'row' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.category_id === 3}
                        onChange={() => handleCheckboxChange('category_id', 3)}
                      />
                    }
                    label="Magazine"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.category_id === 2}
                        onChange={() => handleCheckboxChange('category_id', 2)}
                      />
                    }
                    label="Livre"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.category_id === 1}
                        onChange={() => handleCheckboxChange('category_id', 1)}
                      />
                    }
                    label="Bande dessinée"
                  />
                </FormGroup>
              </div>
              <div>
                <h3>Audience</h3>
                <FormGroup style={{ display: 'flex', flexDirection: 'row' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.audience_id === 1}
                        onChange={() => handleCheckboxChange('audience_id', 1)}
                      />
                    }
                    label="Tout public"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.audience_id === 2}
                        onChange={() => handleCheckboxChange('audience_id', 2)}
                      />
                    }
                    label="jeunesse"
                  />
                </FormGroup>
              </div>
              <div>
                <h3>Condition</h3>
                <FormGroup style={{ display: 'flex', flexDirection: 'row' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.condition_id === 1}
                        onChange={() => handleCheckboxChange('condition_id', 1)}
                      />
                    }
                    label="Comme  neuf"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.condition_id === 2}
                        onChange={() => handleCheckboxChange('condition_id', 2)}
                      />
                    }
                    label="Bon état"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.condition_id === 3}
                        onChange={() => handleCheckboxChange('condition_id', 3)}
                      />
                    }
                    label="Abimé"
                  />
                </FormGroup>
              </div>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                sx={{
                  mb: 6,
                  backgroundColor: '#95C23D',
                  '&:hover': {
                    backgroundColor: '#7E9D2D',
                  },
                }}
              >
                Publier
              </Button>
            </Grid>
          </Grid>
        </form>
        <CustomToast
          open={successOpen}
          onClose={() => setSuccessOpen(false)}
          severity="success"
        >
          Ajout réussi !
        </CustomToast>
        <CustomToast
          open={errorOpen}
          onClose={() => setErrorOpen(false)}
          severity="error"
        >
          Echec, remplissez tous les champs
        </CustomToast>
      </div>
    </div>
  );
}

export default AddPostPage;
