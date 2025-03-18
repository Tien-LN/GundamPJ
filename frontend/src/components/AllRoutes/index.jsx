import {useRoutes} from "react-router-dom";
import "../../routes/client";
import { routes } from "../../routes/client";
import { routesAdmin } from "../../routes/admin";

function AllRoutes(){
    const elementsRoutes = [...routes, ...routesAdmin];
    const elements = useRoutes(elementsRoutes);
    return <>
        {elements}
    </>
}
export default AllRoutes;