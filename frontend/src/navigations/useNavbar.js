import navService from "./nav.service"
import { useDispatch } from "react-redux";
import { setResults } from "../store/features/nav.slice";
import { useSelector } from "react-redux";

const useNavbar = () => {

    const dispatch = useDispatch()
    const results = useSelector((state) => state.nav.results)

    const handleSearch = async (search) => {
        const result = await navService.search(search)
        dispatch(setResults(result.data))
    }


    return {
        handleSearch,
        results,
    }
}

export default useNavbar