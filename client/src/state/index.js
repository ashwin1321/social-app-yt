import { createSlice } from "@reduxjs/toolkit";

// stored in global state and can be accessed by any component
const initialState = {
  mode: "light", // light or dark mode
  user: null, // user object
  token: null, // token for authentication
  posts: [],
};

export const authslice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    // reducers are functions that take in the current state and an action and return a new state
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light"; // toggle between light and dark mode
    },

    setLogin: (state, action) => {
      // action.payload is the data passed in
      state.user = action.payload.user;
      state.token = action.payload.token;
    },

    setLogout: (state) => {
      // set user and token to null
      state.user = null;
      state.token = null;
    },

    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.log("user friends non existent");
      }
    },

    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },

    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) {
          // if the post id matches the id of the post passed in
          return action.payload.post;
        }
        state.posts = updatedPosts;
      });
    },
  },
});

export const { setMode, setLogin, setLogout, setFriends, setPosts, setPost } =
  authslice.actions;
export default authslice.reducer;
