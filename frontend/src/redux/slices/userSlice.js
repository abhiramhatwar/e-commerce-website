import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    _id: "",
    firstname: "",
    lastname: "",
    email: "",
    token: "",
    isAdmin: false,
  },
  reducers: {
    addUser: (state, action) => {
      const { _id, firstname, lastname, email, token, isAdmin } = action.payload;
      state._id = _id;
      state.firstname = firstname;
      state.lastname = lastname;
      state.email = email;
      state.token = token;
      state.isAdmin = isAdmin;
    },
    updateUser: (state, action) => {
      const { email, firstname, lastname } = action.payload;
      state.firstname = firstname;
      state.lastname = lastname;
      state.email = email;
    },
    removeUser: () => {
      return {
        firstname: "",
        lastname: "",
        email: "",
        token: "",
        isAdmin: false,
      };
    },
  },
});

export const { addUser, removeUser, updateUser } = userSlice.actions;
export default userSlice.reducer;
