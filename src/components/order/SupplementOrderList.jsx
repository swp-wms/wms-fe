const SupplementOrderList = ({supplementList,className =""}) =>{
    const total = (array, criteria) => {
        let sum = 0;
        array.forEach(item => {
            if (item[criteria]) sum += item[criteria];

        });
        return sum;
    }

    return(
        <div className={className}>
            {supplementList != null && (
                <button className=" p-3 ml-2 border-1 border-gray-200 shadow-md">
                    {supplementList.map((item,index) => (
                        <div key={index} className="flex flex-col w-full">
                            <div className="">{item.createdate}</div>
                            <div className="">{total(item.detail,"numberofbars")}</div>
                            <div className="">{total(item.detail,"weight")}</div>
                        </div>
                    ))}
                    
                </button>

            )}
        </div>

    );
}

export default SupplementOrderList;