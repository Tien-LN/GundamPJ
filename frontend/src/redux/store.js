import { createStore } from "redux";
import userReducer from "./userReducer";

const persistedState = localStorage.getItem("user")
    ? { user: JSON.parse(localStorage.getItem("user")) }
    : { user: null };

const store = createStore(userReducer, persistedState);

// 🛠 Khi Redux thay đổi, lưu lại vào localStorage
store.subscribe(() => {
    localStorage.setItem("user", JSON.stringify(store.getState().user));
});

export default store;