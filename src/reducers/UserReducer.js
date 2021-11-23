export const initialState = {
  token: '',
  user_id: 0,
  username: '',
};

const ADD = 'ADD';
const DELETE = 'DELETE';

export function userReducer(state, action) {
  switch (action.type) {
    case ADD:
      return {
        ...state,
        ...action.payload.user,
      };
    case DELETE:
      return {
        ...state,
        token: '',
        user_id: 0,
        username: '',
      };
    default:
      return { ...state };
  }
}

export function addUser(user) {
  return {
    type: ADD,
    payload: {
      user: {
        ...user,
      },
    },
  };
}

export function deleteUser(user) {
  return {
    type: DELETE,
    payload: {
      user: {
        ...user,
      },
    },
  };
}
