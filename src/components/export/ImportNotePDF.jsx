import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import Roboto from './font/Roboto_Condensed-Medium.ttf';
import RobotoRegular from './font/Roboto_Condensed-Regular.ttf';
import VNnum2words from 'vn-num2words';

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
  colHang: { width: '20%' },
  colMaVt: { width: '15%' },
  colTenVatTu: { width: '20%' },
  colDvt: { width: '10%' },
  colSoLuong: { width: '10%' },
  colKhoiLuong: { width: '10%' },
  colNote: { width: '10%' },

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

const ImportNotePDF = ({ currentDelivery, currentDeliveryDetail, currentOrder }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.companyInfo}>
          <Text style={{ fontSize: 11, fontFamily: 'RobotoRegular' }}>CÔNG TY CỔ PHẦN THÉP ĐẤT VIỆT</Text>
          <Text>Ngõ 51, Phố Đốc Ngữ, P.Liễu Giai, Q.Ba Đình, Hà Nội</Text>
        </View>
        <View style={styles.formInfo}>
          <Text style={{ fontSize: 10 }}>Số phiếu: PN-{currentDelivery.id}</Text>
        </View>
      </View>

      {/* Form Title */}
      <Text style={styles.formTitle}>PHIẾU NHẬP KHO</Text>
      <View style={styles.dateInfo}>
        <Text>Ngày {(new Date).getDay()} tháng {(new Date).getMonth()} năm {(new Date).getFullYear()}</Text>
      </View>

      {/* Recipient/Delivery Info */}
      <View style={styles.section}>
        <View style={styles.sectionRow}>
          <Text style={styles.label}>Họ và tên người giao hàng:</Text>
          <Text style={styles.value}>{currentDelivery.drivername}</Text>
        </View>
        <View style={styles.sectionRow}>
          <Text style={styles.label}>Biển số xe:</Text>
          <Text style={styles.value}>{currentDelivery.licenseplate}</Text>
        </View>
        <View style={styles.sectionRow}>
          <Text style={styles.label}>Đơn vị:</Text>
          <Text style={styles.value}>{currentOrder.partnerid} - {currentOrder.partnername}</Text>
        </View>
        <View style={styles.sectionRow}>
          <Text style={styles.label}>Nhận tại kho:</Text>
          <Text style={styles.value}>Kho thép Đất Việt</Text>
        </View>
      </View>

      {/* Table */}
      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.tableRow}>
          <View style={[styles.tableColHeader, styles.colSTT]}><Text>STT</Text></View>
          <View style={[styles.tableColHeader, styles.colHang]}><Text>Hãng</Text></View>
          <View style={[styles.tableColHeader, styles.colMaVt]}><Text>Mã vật tư</Text></View>
          <View style={[styles.tableColHeader, styles.colTenVatTu]}><Text>Tên vật tư</Text></View>
          <View style={[styles.tableColHeader, styles.colDvt]}><Text>Đơn vị tính</Text></View>
          <View style={[styles.tableColHeader, styles.colSoLuong]}><Text>Số lượng</Text></View>
          <View style={[styles.tableColHeader, styles.colKhoiLuong]}><Text>Khối lượng</Text></View>
          <View style={[styles.tableColHeader, styles.colNote]}><Text>Ghi chú</Text></View>
        </View>
        {/* Table Rows */}
        {currentDeliveryDetail.deliveryDetail.map((item, index) => (
          <View style={styles.tableRow} key={index}>
            <View style={[styles.tableCol, styles.colSTT]}><Text>{index + 1}</Text></View>
            <View style={[styles.tableCol, styles.colHang]}><Text>{item.brandname}</Text></View>
            <View style={[styles.tableCol, styles.colMaVt]}><Text>{item.name}</Text></View>
            <View style={[styles.tableCol, styles.colTenVatTu]}><Text>{item.namedetail}</Text></View>
            <View style={[styles.tableCol, styles.colDvt]}><Text>kg</Text></View>
            <View style={[styles.tableCol, styles.colSoLuong]}><Text>{item.realnumberofbars}</Text></View>
            <View style={[styles.tableCol, styles.colKhoiLuong]}><Text>{item.realtotalweight}</Text></View>
            <View style={[styles.tableCol, styles.colNote]}><Text>{item.note}</Text></View>
          </View>
        ))}
      </View>

      {/* Summary Section */}
      <View style={styles.summary}>
        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>Tổng cộng:</Text>
          <Text style={styles.totalValue}>{currentDeliveryDetail.realsum} kg</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text>Tổng số tiền (Viết bằng chữ): {String(currentDeliveryDetail.realsum).split('.').length > 1 
        ? `${VNnum2words(String(currentDeliveryDetail.realsum).split('.')[0])} phẩy ${VNnum2words(String(currentDeliveryDetail.realsum).split('.')[1])}`
        : VNnum2words(currentDeliveryDetail.realsum)} kilogram</Text>
      </View>

      {/* Footer / Signatures */}
      <View style={styles.footer}>
        <View style={styles.signatureBlock}>
          <Text style={styles.signatureLabel}>THỦ KHO</Text>
          <Text style={styles.signatureNote}>(Ký, họ tên)</Text>
        </View>
        <View style={styles.signatureBlock}>
          <Text style={styles.signatureLabel}>NGƯỜI GIAO HÀNG</Text>
          <Text style={styles.signatureNote}>(Ký, họ tên)</Text>
        </View>
      </View>

    </Page>
  </Document>
);

export default ImportNotePDF;
