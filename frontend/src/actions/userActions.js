import userService from '../services/userService';
import { loading, doneLoading } from './systemActions';

// THUNK
export function loadUsers() {
  return async dispatch => {
    try {
      // example for loading
      dispatch(loading);
      const users = await userService.getUsers();
      dispatch({ type: 'SET_USERS', users });
    } catch (err) {
      console.log('UserActions: err in loadUsers', err);
      // example for routing - after changing the store
      // history.push('/some/path');
    } finally {
      dispatch(doneLoading);
    }
  };
}
// THUNK
export function removeUser(userId) {
  return async dispatch => {
    try {
      await userService.remove(userId);
      dispatch({ type: 'USER_REMOVE', userId });
    } catch (err) {
      console.log('UserActions: err in removeUser', err);
    }
  };
}
// THUNK
export function login(userCreds) {
  return async dispatch => {
    const user = await userService.login(userCreds);
    dispatch({ type: 'SET_USER', user });
  };
}
export function signup(userCreds) {
  return async dispatch => {
    const user = await userService.signup(userCreds);
    dispatch({ type: 'SET_USER', user });
  };
}
export function logout() {
  return async dispatch => {
    await userService.logout();
    dispatch({ type: 'SET_USER', user: null });
  };
}
