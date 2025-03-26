function QuestionMatching({options}){
    if(!options || options.length == 0) return <></>
    const groupCount = Math.ceil(options.length / 2);
    var arr = Array.from({ length: groupCount }, () => []);
    options.forEach((item) => {
        arr[item.num-1].push(item.content);
    })
    // console.log(arr);
    return (
        <>
            {
                arr &&
                arr.map((item, index) => (
                    <tr key={index}>
                        <td>{index+1}</td>
                        <td>{item[0]}</td>
                        <td>{item[1]}</td>
                    </tr>
                ))
            }
        </>
    )
}
export default QuestionMatching;