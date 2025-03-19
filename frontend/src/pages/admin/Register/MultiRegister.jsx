import axios from "axios";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
function MultiRegister(){
    const [rows, setRows] = useState(4);
    const [data, setData] = useState([]);
    const [roles, setRoles] = useState([]);
    useEffect(()=>{
        const fetchApi = async() => {
            try{
                const res = await axios.get("http://localhost:3000/api/roles", {
                    withCredentials: true
                });

                // console.log(res.data);
                setRoles(res.data);
                
            } catch(error){
                console.error("Lỗi", error);
            }
            
        }
        fetchApi();
    }, []);
    const handleChange = (index, event) => {
        const {name, value} = event.target;
        setData(prevData => {
            const newData = [...prevData];
            newData[index] = {...newData[index], [name]: value};
            return newData;
        })
    }
    useEffect(()=> {
        setData(prevData => {
            let newData = [...prevData];

            while(newData.length < rows){
                newData.push({email: "", name: "", role: ""});
            }

            return newData.slice(0, rows);
        })
    }, [rows]);
    const handleAddRows = () => {
        setRows(row => row + 1);
    }
    const handleMinusRows = () => {
        setRows(row => row - 1);
    }
    const handleSubmit = async () => {
        const users = data.filter(user => user.email && user.name && user.role);
        if(users.length == 0){
            console.error("Không có để tạo");
            return;
        }
        
        const DataSend = {
            users: users
        };
        try{
            const res = await axios.post("http://localhost:3000/api/admin/register-multiple", DataSend, {
                headers: {
                    "Content-Type" : "application/json"
                },
                withCredentials: true
            });

            console.log(res.data);
            // navigate("/admin/registers/multi");
            
        } catch(error){
            console.error("Lỗi", error.response);
        }
    }
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if(!file) return;

        const reader = new FileReader();
        reader.readAsArrayBuffer(file);

        reader.onload = (e) => {
            const bufferArray = e.target.result;
            const wb = XLSX.read(bufferArray, {type: "buffer"});
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];

            const excelData = XLSX.utils.sheet_to_json(ws);
            
            const roleType = roles.map(role => role.roleType);
            // console.log(roleType);
            const valueChecked = excelData.filter(record => roleType.includes(record.role));

            setData(valueChecked);
            setRows(valueChecked.length);
        }
    }
    
    return (
        <>
            <div className="MultiRegister">
                
                <h1 className="MultiRegister__title">Tạo nhiều tài khoản</h1>
                <table className="MultiRegister__table">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>email</th>
                            <th>Tên</th>
                            <th>vai trò</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data && 
                            Array.from({length: rows}).map((_, index) => (
                                <tr key={index}>
                                    <td>{index+1}</td>
                                    <td className="MultiRegister__table-td">
                                        <input type="email" name="email" value={data[index]?.email || ""} onChange={(e) => {handleChange(index, e)}}/>
                                    </td>
                                    <td className="MultiRegister__table-td">
                                        <input type="text" name="name" value={data[index]?.name || ""} onChange={(e) => {handleChange(index, e)}}/>
                                    </td>
                                    <td className="MultiRegister__table-td">
                                        <select name="role" value={data[index]?.role || ""} onChange={(e) => {handleChange(index, e)}}>
                                            <option value="" disabled>---Chọn---</option>
                                            {
                                                roles.map((role,roleIndex) => (
                                                    <option key={roleIndex} value={role.roleType}>{role.title}</option>
                                                ))
                                            }
                                        </select>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                <div className="MultiRegister__submit-Contain">
                    <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
                    <button className="MultiRegister__submit" onClick={handleSubmit}>Gửi</button>
                </div>
                
                <div className="MultiRegister__changeRows">
                    <button className="MultiRegister__addRows" onClick={handleAddRows}>+</button>
                    <button className="MultiRegister__minusRows" onClick={handleMinusRows}>-</button>
                </div>
                
            </div>
        </>
    )
}
export default MultiRegister;