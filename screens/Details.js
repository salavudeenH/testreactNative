import React, { useState } from 'react';
import { StyleSheet, Button, View, SafeAreaView, Text, Alert, Image, ScrollView } from 'react-native';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

const Details = ({ navigation, route }) => {
  const CONTENT = {
    tableHead: ['Column 0/Row 0', 'Column 1', 'Column 2', 'Column 3'],
    tableTitle: ['Row', 'Row 2', 'Row 3', 'Row 4'],
    tableData: [
      ['1', '2', '3'],
      ['a', 'b', 'c'],
      ['1', '2', '3'],
      ['a', 'b', 'c'],
    ],
  };

  return (
    <View style={styles.container}>
      <Table borderStyle={{ borderWidth: 1 }}>
        <Row
          data={CONTENT.tableHead}
          flexArr={[1, 2, 1, 1]}
          style={styles.head}
          textStyle={styles.text}
        />
        <TableWrapper style={styles.wrapper}>
          <Col
            data={CONTENT.tableTitle}
            style={styles.title}
            heightArr={[28, 28]}
            textStyle={styles.text}
          />
          <Rows
            data={CONTENT.tableData}
            flexArr={[2, 1, 1]}
            style={styles.row}
            textStyle={styles.text}
          />
        </TableWrapper>
      </Table>
    </View>
  )
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 100, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: 'orange' },
  wrapper: { flexDirection: 'row' },
  title: { flex: 1, backgroundColor: '#2ecc71' },
  row: { height: 28 },
  text: { textAlign: 'center' },
});
export default Details;