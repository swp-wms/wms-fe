import { faStickyNote } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"


const Delivery = () => {
  return (
    <div>
      <div className="w-1/3">
        <h1>Đơn nhập hàng</h1>
        <ul>
          <li className="flex relative justify-between p-2 border-[1.5px] rounded border-black items-center">
            <div className="z-[-2] absolute top-0 bottom-0 left-0 bg-[var(--fill-color)] w-1/2"></div>
            
            <div className="">
              <p>ABC Company</p>
              <p>Hoàn thành: 50%</p>
            </div>
            <div className="">
              <FontAwesomeIcon icon={faStickyNote}/>
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Delivery