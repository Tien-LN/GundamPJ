const initialState = {
    user: null,
    loading: false,
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_USER":
            console.log("Redux nhận action SET_USER:", action.payload);
            return { ...state, user: action.payload };
        case "LOGOUT":
            return { ...state, user: null };
        case "name":
            console.log(action.payload);
            return { ...state, [action.type]: action.payload };
        default:
            return state;
    }
};

export default userReducer;