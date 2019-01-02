const initialState = {
    data: null, 
}

const userReducer = (state = initialState, action) => {
  if (action.type === 'USER_LOGGED_IN')
  {
    const user_data = JSON.stringify(action.payload);
    console.log('Logged in, saving', user_data);
    window.localStorage.setItem("user", user_data);
    return Object.assign({}, state, {
      data: action.payload
    })
  }

  if (action.type === 'USER_LOGGED_OUT')
  {
    window.localStorage.setItem("user", null);
    return Object.assign({}, state, {
      data: null
    })
  }

  return state
}

export default userReducer
