'use client'

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addKeyword } from "../../../features/filter/candidateFilterSlice";

const SearchBox = () => {
    const dispatch = useDispatch();
    const { keyword } = useSelector((state) => state.candidateFilter) || {};
    const [localKeyword, setLocalKeyword] = useState(keyword || "");

    // Update local state when Redux state changes
    useEffect(() => {
        setLocalKeyword(keyword || "");
    }, [keyword]);

    // Handle input change with immediate dispatch
    const handleInputChange = (e) => {
        const value = e.target.value;
        setLocalKeyword(value);
        dispatch(addKeyword(value));
    };

    return (
        <>
            <input
                type="text"
                name="listing-search"
                placeholder="Cleaner name or service type"
                value={localKeyword}
                onChange={handleInputChange}
            />
            <span className="icon flaticon-search-3"></span>
        </>
    );
};

export default SearchBox;
