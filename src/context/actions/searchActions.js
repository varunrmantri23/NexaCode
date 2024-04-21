export const SET_SEARCH_TERM = (searchterm) => {
    return {
        type: "SET_SEARCH_TERM",
        searchterm: searchterm,
    };
};

export const SET_SEARCH_TERM_EMPTY = () => {
    return {
        type: "SET_SEARCH_TERM_EMPTY",
    };
};
