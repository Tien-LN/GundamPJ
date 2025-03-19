import { useEffect, useState } from "react";
import { accountRoles } from "../../helpers/admin/Accounts/filterRole";
import { useSearchParams } from "react-router-dom";
function FilterRole(){
    const [filters, setFilters] = useState(accountRoles);
    const [searchParams, setSearchParams] = useSearchParams();

    const curFilter = searchParams.get("filterRole") || "";

    useEffect(() => {
        const buttons = document.querySelectorAll("[data-filter-role]") || [];
        let url = new URL(window.location.href);
        buttons.forEach(button => {
            const role = button.getAttribute("data-filter-role");

            button.classList.remove("active");

            if(role == curFilter){
                button.classList.add("active");
            }
            
            const handleClick = () => {
                const newParams = new URLSearchParams(searchParams);

                if(role){
                    newParams.set("filterRole", role);
                } else {
                    newParams.delete("filterRole");
                }

                setSearchParams(newParams);
            }


            button.removeEventListener("click", handleClick);
            button.addEventListener("click", handleClick);
        });

    }, [curFilter]);
    return (
        <>
            <div className="accounts__filter">
                {filters && 
                    filters.map((item,index) => (
                    <button key={index} className="accounts__filter-role" data-filter-role={item.role}>{item.name}</button>
                ))}
            </div>
        </>
    )
}
export default FilterRole;