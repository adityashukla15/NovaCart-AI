import api from "./axios";

export const sendContactMessage = (data) => {

    return api.post(
        "/contact",
        data
    );

};