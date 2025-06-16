import Order from "./Order"


const OrderList = () => {
    return (
        <ul className="text-[15px] h-[90%] overflow-y-scroll p-[4px]">
            <Order order={{
                partnername:'ABC Company',
                complete: '50%'
            }}/>
            <Order order={{
                partnername:'Thanh Anh Company',
                complete: '80%'
            }}/>
            <Order order={{
                partnername:'Hoai Duc Company',
                complete: '0%'
            }}/>
            <Order order={{
                partnername:'Trieu thu Company',
                complete: '98%'
            }}/>
            <Order order={{
                partnername:'Van Anh Company',
                complete: '38%'
            }}/>
            <Order order={{
                partnername:'Van Anh Company',
                complete: '38%'
            }}/>
        </ul>
    )
}

export default OrderList