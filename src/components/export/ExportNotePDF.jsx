import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import Roboto from './font/Roboto_Condensed-Medium.ttf';
import RobotoRegular from './font/Roboto_Condensed-Regular.ttf';

Font.register({
  family: 'Roboto',
  src: Roboto,
});
Font.register({
  family: 'RobotoRegular',
  src: RobotoRegular,
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'RobotoRegular', // Use the registered RobotoRegular font for the entire document
    fontSize: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottom: '1pt solid #000',
    paddingBottom: 10,
  },
  companyInfo: {
    width: '50%',
  },
  formInfo: {
    width: '45%',
    alignItems: 'flex-end',
    textAlign: 'right',
  },
  formTitle: {
    fontSize: 16,
    fontFamily: 'RobotoRegular', // Use bold variant for titles
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  dateInfo: {
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 10,
  },
  sectionRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    fontFamily: 'RobotoRegular', // Use bold variant for labels
    width: '20%',
  },
  value: {
    width: '80%',
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderColor: '#bfbfbf',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 20,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableColHeader: {
    width: 'auto',
    borderStyle: 'solid',
    borderColor: '#bfbfbf',
    borderBottomColor: '#000',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    backgroundColor: '#f2f2f2',
    textAlign: 'center',
    fontFamily: 'RobotoRegular', // Use bold variant for table headers
  },
  tableCol: {
    width: 'auto',
    borderStyle: 'solid',
    borderColor: '#bfbfbf',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    textAlign: 'center',
  },
  // Specific column widths for the table
  colSTT: { width: '5%' },
  colMaKho: { width: '10%' },
  colMaVt: { width: '10%' },
  colTenVatTu: { width: '30%' },
  colDvt: { width: '8%' },
  colSoLuong: { width: '10%' },
  colDonGia: { width: '12%' },
  colThanhTien: { width: '15%' },

  summary: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  totalBox: {
    border: '1pt solid #000',
    padding: 5,
    flexDirection: 'row',
    width: '30%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontFamily: 'RobotoRegular', // Use bold variant
  },
  totalValue: {
    fontFamily: 'RobotoRegular', // Use bold variant
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
    textAlign: 'center',
  },
  signatureBlock: {
    width: '20%',
    alignItems: 'center',
  },
  signatureLabel: {
    fontFamily: 'RobotoRegular', // Use bold variant
    marginBottom: 5,
  },
  signatureNote: {
    fontSize: 8,
    fontFamily: 'RobotoRegular', // Apply the italic font
  },
});

// Sample data for the table
const items = [
  { stt: 1, maKho: 'KCVAS', maVt: 'T0808', tenVatTu: 'Thép D8', dvt: 'kg', soLuong: '2.085,00', donGia: '13.019,98', thanhTien: '27.146.817' },
  { stt: 2, maKho: 'KCVAS', maVt: 'TD10CB40', tenVatTu: 'Thép D10CB400V', dvt: 'kg', soLuong: '1.337,00', donGia: '12.722,84', thanhTien: '17.010.437' },
  { stt: 3, maKho: 'KCVAS', maVt: 'TD12CB40', tenVatTu: 'Thép D12CB400V', dvt: 'kg', soLuong: '7.607,00', donGia: '12.854,50', thanhTien: '96.262.782' },
  { stt: 4, maKho: 'KCVAS', maVt: 'TD14CB50', tenVatTu: 'Thép D14CB500V', dvt: 'kg', soLuong: '6.283,00', donGia: '12.935,88', thanhTien: '81.276.008' },
  { stt: 5, maKho: 'KCVAS', maVt: 'TD16CB50', tenVatTu: 'Thép D16CB500V', dvt: 'kg', soLuong: '2.688,00', donGia: '12.841,64', thanhTien: '34.518.328' },
  { stt: 6, maKho: 'KCVAS', maVt: 'TD20CB40', tenVatTu: 'Thép D20CB400V', dvt: 'kg', soLuong: '3.196,00', donGia: '12.562,70', thanhTien: '40.201.727' },
  { stt: 7, maKho: 'KCVAS', maVt: 'TD22CB40', tenVatTu: 'Thép D22CB400V', dvt: 'kg', soLuong: '4.924,00', donGia: '12.775,93', thanhTien: '62.908.679' },
  { stt: 8, maKho: 'KCVAS', maVt: 'TD25CB40', tenVatTu: 'Thép D25CB400V', dvt: 'kg', soLuong: '4.946,00', donGia: '13.070,00', thanhTien: '64.644.220' },
];

const ExportNotePDF = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.companyInfo}>
          <Text style={{ fontSize: 11, fontFamily: 'RobotoRegular' }}>CÔNG TY CỔ PHẦN THÉP ĐẤT VIỆT</Text>
          <Text>Ngõ 51, Phố Đốc Ngữ, P.Liễu Giai, Q.Ba Đình, Hà Nội</Text>
        </View>
        <View style={styles.formInfo}>
          <Text style={{ fontSize: 10 }}>Số phiếu: PN-167</Text>
        </View>
      </View>

      {/* Form Title */}
      <Text style={styles.formTitle}>PHIẾU NHẬP KHO</Text>
      <View style={styles.dateInfo}>
        <Text>Ngày <Text style={{ textDecoration: 'underline' }}> 3 </Text> tháng <Text style={{ textDecoration: 'underline' }}> 1 </Text> năm <Text style={{ textDecoration: 'underline' }}> 2025 </Text></Text>
      </View>

      {/* Recipient/Delivery Info */}
      <View style={styles.section}>
        <View style={styles.sectionRow}>
          <Text style={styles.label}>Họ và tên người giao:</Text>
          <Text style={styles.value}>Nguyễn Văn A</Text>
        </View>
        <View style={styles.sectionRow}>
          <Text style={styles.label}>Biển số xe:</Text>
          <Text style={styles.value}>UI9109</Text>
        </View>
        <View style={styles.sectionRow}>
          <Text style={styles.label}>Đơn vị:</Text>
          <Text style={styles.value}>KH001 - Công ty cổ phần tập đoàn thép Nghi Sơn</Text>
        </View>
        <View style={styles.sectionRow}>
          <Text style={styles.label}>Nhận tại kho:</Text>
          <Text style={styles.value}>Kho thép Đất Việt</Text>
        </View>
        <View style={styles.sectionRow}>
          <Text style={styles.label}>Lý do xuất kho:</Text>
          <Text style={styles.value}>Xuất bán hàng cho khách, NM, HTT: ngày (tính từ ngày 02/01/2025)</Text>
        </View>
      </View>

      {/* Table */}
      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.tableRow}>
          <View style={[styles.tableColHeader, styles.colSTT]}><Text>STT</Text></View>
          <View style={[styles.tableColHeader, styles.colMaKho]}><Text>Mã kho</Text></View>
          <View style={[styles.tableColHeader, styles.colMaVt]}><Text>Mã vt</Text></View>
          <View style={[styles.tableColHeader, styles.colTenVatTu]}><Text>Tên vật tư, sản phẩm, hàng hoá</Text></View>
          <View style={[styles.tableColHeader, styles.colDvt]}><Text>Đvt</Text></View>
          <View style={[styles.tableColHeader, styles.colSoLuong]}><Text>Số lượng</Text></View>
          <View style={[styles.tableColHeader, styles.colDonGia]}><Text>Đơn giá</Text></View>
          <View style={[styles.tableColHeader, styles.colThanhTien]}><Text>Thành tiền</Text></View>
        </View>
        {/* Table Rows */}
        {items.map((item, index) => (
          <View style={styles.tableRow} key={index}>
            <View style={[styles.tableCol, styles.colSTT]}><Text>{item.stt}</Text></View>
            <View style={[styles.tableCol, styles.colMaKho]}><Text>{item.maKho}</Text></View>
            <View style={[styles.tableCol, styles.colMaVt]}><Text>{item.maVt}</Text></View>
            <View style={[styles.tableCol, styles.colTenVatTu]}><Text>{item.tenVatTu}</Text></View>
            <View style={[styles.tableCol, styles.colDvt]}><Text>{item.dvt}</Text></View>
            <View style={[styles.tableCol, styles.colSoLuong]}><Text>{item.soLuong}</Text></View>
            <View style={[styles.tableCol, styles.colDonGia]}><Text>{item.donGia}</Text></View>
            <View style={[styles.tableCol, styles.colThanhTien]}><Text>{item.thanhTien}</Text></View>
          </View>
        ))}
      </View>

      {/* Summary Section */}
      <View style={styles.summary}>
        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>Tổng cộng:</Text>
          <Text style={styles.totalValue}>423.968.798</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text>Tổng số tiền (Viết bằng chữ): Bốn trăm hai mươi ba triệu, chín trăm sáu mươi tám nghìn, bảy trăm chín mươi tám đồng chẵn!</Text>
        <Text>Kèm theo: 0 chứng từ gốc</Text>
      </View>

      {/* Footer / Signatures */}
      <View style={styles.footer}>
        <View style={styles.signatureBlock}>
          <Text style={styles.signatureLabel}>NGƯỜI LẬP PHIẾU</Text>
          <Text style={styles.signatureNote}>(Ký, họ tên)</Text>
        </View>
        <View style={styles.signatureBlock}>
          <Text style={styles.signatureLabel}>NGƯỜI NHẬN HÀNG</Text>
          <Text style={styles.signatureNote}>(Ký, họ tên)</Text>
        </View>
        <View style={styles.signatureBlock}>
          <Text style={styles.signatureLabel}>THỦ KHO</Text>
          <Text style={styles.signatureNote}>(Ký, họ tên)</Text>
        </View>
        <View style={styles.signatureBlock}>
          <Text style={styles.signatureLabel}>KẾ TOÁN TRƯỞNG</Text>
          <Text style={styles.signatureNote}>(Ký, họ tên)</Text>
        </View>
        <View style={styles.signatureBlock}>
          <Text style={styles.signatureLabel}>GIÁM ĐỐC</Text>
          <Text style={styles.signatureNote}>(Ký, họ tên)</Text>
        </View>
      </View>
      <View style={{ ...styles.dateInfo, marginTop: 10 }}>
        <Text>Ngày ...... tháng ...... năm ......</Text>
      </View>

    </Page>
  </Document>
);

export default ExportNotePDF;
