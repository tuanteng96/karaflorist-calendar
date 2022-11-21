import axiosClient from "../../../../redux/axioClient";

const GET_MEMBERS_STAFF_URL = "/api/gl/select2";
const GET_ROOT_SERVICES_URL = "/api/v3/mbook";
const POST_BOOKING_URL = "/api/v3/mbookadmin?cmd=AdminBooking";

const getMembers = (key) => {
    return axiosClient.get(`${GET_MEMBERS_STAFF_URL}?cmd=member&q=${key}`);
};
const getStaffs = ({ StockID, key, All, Type }) => {
    return axiosClient.get(`${GET_MEMBERS_STAFF_URL}?cmd=user&roles=${Type}&crstockid=${StockID}&q=${key}${All ? "&all=1" : ""}`);
};
const getRootServices = ({ MemberID, StockID, Key }) => {
    return axiosClient.get(`${GET_ROOT_SERVICES_URL}?cmd=getroot&memberid=${MemberID}&ps=15&pi=1&key=${Key}=&stockid=${StockID}`);
}
const postBooking = (data, { CurrentStockID, u_id_z4aDf2 }) => {
    return axiosClient.post(`${POST_BOOKING_URL}&CurrentStockID=${CurrentStockID}&u_id_z4aDf2=${u_id_z4aDf2}`, JSON.stringify(data));
};

const deleteBooking = (data, { CurrentStockID, u_id_z4aDf2 }) => {
    return axiosClient.post(`${POST_BOOKING_URL}&CurrentStockID=${CurrentStockID}&u_id_z4aDf2=${u_id_z4aDf2}`, JSON.stringify(data));
};

const getBooking = ({ MemberID, From, To, StockID, Status, UserServiceIDs, StatusMember, StatusBook, StatusAtHome, UserID }) => {
    return axiosClient.get(`/api/v3/mbookadmin?cmd=getbooks&memberid=${MemberID}&from=${From}&to=${To}&stockid=${StockID}&status=${Status}&UserServiceIDs=${UserServiceIDs}&StatusMember=${StatusMember}&StatusBook=${StatusBook}&StatusAtHome=${StatusAtHome}&UserID=${UserID}`);
}

const createMember = (data) => {
    return axiosClient.post("/api/v3/member23?cmd=add", JSON.stringify(data))
}
const checkinMember = (data) => {
    return axiosClient.post("/services/preview.aspx?cmd=checkin", data, {
        headers: {
            "Authorization": `Bearer ${window.top?.Info?.token}`,
        }
    })
}

const getConfigName = (name) => {
    return axiosClient.get(`/api/v3/config?cmd=getnames&names=${name}&ignore_root=1`)
}

const saveConfigName = (name, data) => {
    return axiosClient.post(`/api/v3/ConfigJson@save?name=${name}`, JSON.stringify(data))
}

const CalendarCrud = {
    getMembers,
    getStaffs,
    getRootServices,
    postBooking,
    deleteBooking,
    getBooking,
    createMember,
    checkinMember,
    getConfigName,
    saveConfigName
};
export default CalendarCrud;