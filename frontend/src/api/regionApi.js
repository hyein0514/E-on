import axios from "./axiosInstance";

// 1. 전체 지역 조회
export const getRegionList = async () => {
    return axios.get("/regions");
}

// 2. 지역명 검색
export const searchRegionByName = async (regionName) => {
    return axios.get(`/regions/search?region_name=${regionName}`);
}