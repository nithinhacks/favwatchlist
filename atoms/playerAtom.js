import { atom } from "recoil";

export const modalState = atom({
  key: "modalState",
  default: false,
});

export const movieState = atom({
  key: "movieState",
  default: null,
});

export const playlistState = atom({
  key: "playlistState",
  default: [],
});
