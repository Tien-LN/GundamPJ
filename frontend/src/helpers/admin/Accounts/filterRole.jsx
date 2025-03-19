export const accountRoles = () => {
    let filterRoles = [
        {
            name: "Tất cả",
            role: ""
        },
        {
            name: "Giáo viên",
            role: "TEACHER"
        },
        {
            name: "Học sinh",
            role: "STUDENT"
        }
    ];
    return filterRoles;
}