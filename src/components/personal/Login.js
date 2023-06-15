/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { Link, Box, Typography, Grid, Checkbox, FormControlLabel, TextField, Button, IconButton, ThemeProvider } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchPrivateMovies } from 'reducers/location';
import { theme } from 'components/styles/muiTheme';
import user from 'reducers/user';
import { SlidingCardRight } from 'components/styles/Cards';
import menus from '../../reducers/menus'

export const Login = () => {
  const loginUrl = process.env.REACT_APP_LOGIN_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordErrorText, setPasswordErrorText] = useState('');

  // Login-handler
  const handleLoginSubmit = (event) => {
    event.preventDefault();
    const { username, password } = event.target.elements;
    const data = {
      username: username.value,
      password: password.value
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };

    // Form validation
    const validateFields = () => {
      let isValid = true;

      if (!data.username) {
        setUsernameError(true);
        isValid = false;
      } else {
        setUsernameError(false);
      }

      if (!data.password) {
        setPasswordError(true);
        setPasswordErrorText('Password is required');
        isValid = false;
      } else {
        setPasswordError(false);
        setPasswordErrorText('');
      }
      return isValid;
    };
    // fetches and dispatches data to store
    if (validateFields(true)) {
      fetch(loginUrl, options)
        .then((response) => response.json())
        .then((json) => {
          if (json.success) {
            const { accessToken } = json.response;
            dispatch(user.actions.setUser({
              userName: json.response.username,
              userId: json.response.id,
              accessToken: json.response.accessToken,
              error: null
            }))
            dispatch(fetchPrivateMovies(accessToken));
            navigate('/');
          } else {
            dispatch(user.actions.setUser({
              userName: null,
              userId: null,
              accessToken: null,
              error: json.response.message
            }));
            setPasswordError(true);
            setPasswordErrorText('Incorrect username or password');
          }
        })
        .catch((error) => console.log(error));
    }
  }

  const handleOnClearClick = () => {
    dispatch(menus.actions.toggleLoginPage(false));
    navigate('/');
  }

  return (
    <SlidingCardRight loginregister>
      <ThemeProvider theme={theme}>
        <IconButton
          aria-label="clear"
          sx={{ alignSelf: 'flex-start' }}
          onClick={() => handleOnClearClick()}>
          <ClearIcon
            sx={{ fontSize: '16px' }} />
        </IconButton>
        <Typography
          component="h1"
          variant="h5"
          sx={{ alignSelf: 'center' }}>
          Sign in
        </Typography>

        <Box
          component="form"
          onSubmit={handleLoginSubmit}
          noValidate
          sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            error={usernameError}
            helperText="Username is required"
            autoFocus />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            error={passwordError}
            helperText={passwordErrorText}
            autoComplete="current-password" />
          <FormControlLabel
            control={
              <Checkbox
                value="remember"
                color="primary" />
            }
            label="Remember me" />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2
            }}>
            Sign In
          </Button>
          <Grid container>
            <Grid item>
              <Link
                href="/user/register"
                variant="body2">
                Not a user? Register here...
              </Link>
            </Grid>
          </Grid>
        </Box>
      </ThemeProvider>
    </SlidingCardRight>
  );
}