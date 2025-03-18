function CloseSider(){
    const clickHandle = () => {
        const siders = document.querySelector("#siders");
        const offset2 = document.querySelector("#offset-2");
        if(siders && offset2){
            siders.classList.toggle("d-none");
            offset2.classList.toggle("d-none");
        }
    }
    return (
        <>
            <button className="admin__header-closeSide" onClick={clickHandle}>
                    <i className="fa-solid fa-bars"></i>
            </button>
        </>
    )
}
export default CloseSider;