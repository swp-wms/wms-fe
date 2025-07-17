import { PDFViewer } from "@react-pdf/renderer"
import ImportNotePDF from "../export/ImportNotePDF"


const PDFPopup = ({ setShowNote, currentDelivery, act, currentDeliveryDetail, currentOrder }) => {

    return (
        <div className="fixed ml-[18%] z-10 bg-[#0f0b0b78] bottom-0 right-0 left-0 top-0 flex items-center justify-center"
            onClick={() => setShowNote(false)}
        >
            <div onClick={(e) => e.stopPropagation()}>

                <PDFViewer style={{ width: '60vw', height: '70vh' }}>
                    <ImportNotePDF currentDelivery={currentDelivery} currentOrder={currentOrder} currentDeliveryDetail={currentDeliveryDetail}/>
                </PDFViewer>
            </div>
        </div>
    )
}

export default PDFPopup