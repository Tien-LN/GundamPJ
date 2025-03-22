function EnrollmentStatus({status}){
    if(status == "PENDING") return (
        <>
            <div className="enrollments__pending">Đang chờ duyệt</div>
        </>
    )
    if(status == "APPROVED") return (
        <>
            <div className="enrollments__approved">Đã chấp nhận</div>
        </>
    )
    if(status == "CANCELED") return (
        <>
            <div className="enrollments__canceled">Đã từ chối</div>
        </>
    )
    return (
        <>
        </>
    )
}
export default EnrollmentStatus;