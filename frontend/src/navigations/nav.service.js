import {api} from "../utils/axios.utils";

const navService = {

    async search(query) {
        const res = await api.get(`/search?q=${query}`);
        return res.data;
    }

}

export default navService