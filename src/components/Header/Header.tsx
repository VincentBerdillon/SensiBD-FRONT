import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';
// importation des icones de la libraire material UI
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import {
  Button,
  Checkbox,
  Divider,
  Drawer,
  FormControlLabel,
  FormGroup,
  IconButton,
  Slider,
  TextField,
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { ChangeEvent, FormEvent, useState } from 'react';
import logo from '../../assets/leaf_color.png';
import leafIcon from '../../assets/feuille.png';
import { setSearchText } from '../../store/reducers/posts';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import './Header.scss';
import { FilterData as TFilterData } from '../../@types/filterData';

function Header() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const isLogged = useAppSelector((state) => state.user.isLogged);

  //* Drawer
  const drawerWidth = 340;
  const [open, setOpen] = useState(false);
  const [drawerData, setDrawerData] = useState<TFilterData>({
    distance: 5,
    category_id: null,
    audience_id: null,
    condition_id: null,
  });
  const DrawerHeader = styled('div')(() => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
  }));

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setDrawerData({ ...drawerData, distance: newValue });
  };

  // En fonction de la category de la checkbox, on met à jour la valeur qui lui est associée dans le drawerData
  const handleCheckboxChange = (category: keyof TFilterData, value: number) => {
    setDrawerData((prevData) => ({
      ...prevData,
      [category]: prevData[category] === value ? '' : value,
    }));
  };

  const handleDrawerSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('drawer data :', drawerData);
  };

  //* Barre de recherche

  const searchText = useAppSelector((state) => state.posts.searchText);

  // récupération et stockage de la recherche utilisateur
  const handleChangeSearchValue = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    dispatch(setSearchText(event.target.value));
    console.log('texte tapé :', event.target.value);
  };

  const handleSubmitSearchValue = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('texte à rechercher :', searchText);
  };

  return (
    <header className="header">
      <div className="header__topContainer">
        <div className="header__topContainer-logo-container">
          <Link to="/">
            <img
              src={logo}
              className="header__topContainer-logo"
              alt="Logo Leeaf"
            />
          </Link>
        </div>
        <div className="header__topContainer-credit">
          {isLogged ? (
            <div className="header__topContainer-credit-count">10</div>
          ) : (
            ''
          )}
          <Link to="/credits">
            <img
              src={leafIcon}
              className="header__topContainer-credit-logo"
              alt="Logo Leeaf"
            />
          </Link>
        </div>
      </div>
      <div className="header__searchContainer">
        <form
          className="header__searchContainer-searchBar"
          onSubmit={handleSubmitSearchValue}
        >
          <TextField
            variant="standard"
            placeholder="ouvrage, auteur, code postal, ville"
            value={searchText}
            onChange={handleChangeSearchValue}
            InputProps={{
              startAdornment: (
                <SearchIcon color="action" sx={{ color: '#555' }} />
              ),
            }}
          />
        </form>
        <div className="header__searchContainer-filterButton">
          <IconButton
            sx={{ color: '#555' }}
            aria-label="Filters"
            onClick={handleDrawerOpen}
          >
            <TuneIcon />
          </IconButton>
        </div>
      </div>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
          },
        }}
        variant="persistent"
        anchor="right"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            <ChevronRightIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <div className="drawer">
          <h2>Options de filtres</h2>
          <form onSubmit={handleDrawerSubmit}>
            <div>
              <h3>Distance autour de chez vous</h3>
              <Slider
                value={drawerData.distance}
                onChange={handleSliderChange}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value} km`}
                max={10}
                sx={{
                  color: '#95C23D',
                }}
              />
            </div>
            <div className="drawer__categories">
              <h3>Catégories</h3>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={drawerData.category_id === 3}
                      onChange={() => handleCheckboxChange('category_id', 3)}
                    />
                  }
                  label="Magazine"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={drawerData.category_id === 2}
                      onChange={() => handleCheckboxChange('category_id', 2)}
                    />
                  }
                  label="Livres"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={drawerData.category_id === 1}
                      onChange={() => handleCheckboxChange('category_id', 1)}
                    />
                  }
                  label="Bande dsessinée"
                />
              </FormGroup>
            </div>
            <div className="drawer__audience">
              <h3>Age</h3>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={drawerData.audience_id === 1}
                      onChange={() => handleCheckboxChange('audience_id', 1)}
                    />
                  }
                  label="Tout public"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={drawerData.audience_id === 2}
                      onChange={() => handleCheckboxChange('audience_id', 2)}
                    />
                  }
                  label="Jeunesse"
                />
              </FormGroup>
            </div>
            <div className="drawer__condition">
              <h3>Status</h3>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={drawerData.condition_id === 1}
                      onChange={() => handleCheckboxChange('condition_id', 1)}
                    />
                  }
                  label="Comme neuf"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={drawerData.condition_id === 2}
                      onChange={() => handleCheckboxChange('condition_id', 2)}
                    />
                  }
                  label="Bon état"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={drawerData.condition_id === 3}
                      onChange={() => handleCheckboxChange('condition_id', 3)}
                    />
                  }
                  label="Abimé"
                />
              </FormGroup>
            </div>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                backgroundColor: '#95C23D',
                '&:hover': {
                  backgroundColor: '#7E9D2D',
                },
              }}
            >
              Submit
            </Button>
          </form>
        </div>
        <Divider />
      </Drawer>
    </header>
  );
}

export default Header;
