import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import logoUrl from '../../assets/image/logo.png';
Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
});

// You can use relative URL since public folder is served at root
// const logoUrl = '/logo.png';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 20,
    fontSize: 9,
    fontFamily: 'Roboto',
    lineHeight: 1.5,
  },
  logo: {
    width: 80,
    height: 40,
    marginBottom: 10,
    alignSelf: 'center',
  },
  header: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    textDecoration: 'underline',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    backgroundColor: '#f5f5f5',
    padding: 5,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  field: {
    flexDirection: 'row',
    width: '50%',
    paddingRight: 10,
    marginBottom: 4,
  },
  fullWidth: {
    width: '100%',
  },
  label: {
    fontWeight: 'bold',
    minWidth: 90,
    fontSize: 8,
  },
  value: {
    flex: 1,
    fontSize: 8,
  },
  table: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    marginTop: 5,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableHeader: {
    backgroundColor: '#eaeaea',
    fontWeight: 'bold',
    fontSize: 8,
    textAlign: 'center',
    padding: 3,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
  },
  tableCell: {
    fontSize: 8,
    padding: 3,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    textAlign: 'center',
  },
  remarksSection: {
    marginTop: 10,
  },
  remarksRow: {
    flexDirection: 'row',
    marginBottom: 4,
    alignItems: 'flex-start',
  },
  remarksLabel: {
    fontWeight: 'bold',
    width: 140,
    fontSize: 8,
  },
  remarksValue: {
    flex: 1,
    fontSize: 8,
    marginLeft: 5,
  },
});

const EmployeeLeavePDF = ({ data = {} }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString('en-GB');
  };

  const formatFieldName = (fieldName) => {
    if (!fieldName) return 'N/A';
    return fieldName
      .replace(/[_*]/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/\b\w/g, (l) => l.toUpperCase())
      .trim();
  };

  const formatFieldValue = (input) => {
    if (!input || !input.value) return 'N/A';

    if (input.fieldType === 'Date') {
      return formatDate(input.value);
    }

    if (
      input.fieldName?.toLowerCase().includes('expenditure') ||
      input.fieldName?.toLowerCase().includes('pay') ||
      input.fieldName?.toLowerCase().includes('amount')
    ) {
      return `₹${input.value}`;
    }

    return input.value.toString();
  };

  const safe = (val) => (val || val === 0 ? val : 'N/A');

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Image style={styles.logo} src={logoUrl} />
        <Text style={styles.header}>EX INDIA LEAVE APPLICATION</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Employee Details</Text>
          <View style={styles.row}>
            <View style={styles.field}>
              <Text style={styles.label}>Employee Code:</Text>
              <Text style={styles.value}>{safe(data?.employeeCode)}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>{safe(data?.username)}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.field}>
              <Text style={styles.label}>Post:</Text>
              <Text style={styles.value}>{safe(data?.post)}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Department:</Text>
              <Text style={styles.value}>{safe(data?.department)}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.field}>
              <Text style={styles.label}>Unit:</Text>
              <Text style={styles.value}>{safe(data?.unitName)}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Grade:</Text>
              <Text style={styles.value}>{safe(data?.positionGrade)}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.field}>
              <Text style={styles.label}>DOB:</Text>
              <Text style={styles.value}>{formatDate(data?.dob)}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>DOR:</Text>
              <Text style={styles.value}>{formatDate(data?.dor)}</Text>
            </View>
          </View>
        </View>

        {data?.inputs?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Application Details</Text>
            {data?.inputs.map((input, index) => {
              const isEven = index % 2 === 0;
              const isLast = index === data?.inputs.length - 1;
              if (isEven) {
                const next = data?.inputs[index + 1];
                return (
                  <View key={index} style={styles.row}>
                    <View style={styles.field}>
                      <Text style={styles.label}>{formatFieldName(input.fieldName)}:</Text>
                      <Text style={styles.value}>{formatFieldValue(input)}</Text>
                    </View>
                    {next && (
                      <View style={styles.field}>
                        <Text style={styles.label}>{formatFieldName(next.fieldName)}:</Text>
                        <Text style={styles.value}>{formatFieldValue(next)}</Text>
                      </View>
                    )}
                  </View>
                );
              } else if (isLast) {
                return (
                  <View key={index} style={styles.row}>
                    <View style={[styles.field, styles.fullWidth]}>
                      <Text style={styles.label}>{formatFieldName(input.fieldName)}:</Text>
                      <Text style={styles.value}>{formatFieldValue(input)}</Text>
                    </View>
                  </View>
                );
              }
              return null;
            })}
          </View>
        )}

        {data?.tableInputs?.map((tableInput, tableIndex) => (
          <View key={tableIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{tableInput.tblHeading}</Text>
            {tableInput.rows?.length > 0 && (
              <View style={styles.table}>
                <View style={styles.tableRow}>
                  {tableInput.rows[0].inputs.map((input, i) => (
                    <Text key={i} style={[styles.tableHeader, { width: `${100 / tableInput.rows[0].inputs.length}%` }]}>
                      {formatFieldName(input.fieldName)}
                    </Text>
                  ))}
                </View>
                {tableInput.rows.map((row, i) => (
                  <View key={i} style={styles.tableRow}>
                    {row.inputs.map((input, j) => (
                      <Text key={j} style={[styles.tableCell, { width: `${100 / row.inputs.length}%` }]}>
                        {formatFieldValue(input)}
                      </Text>
                    ))}
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        {(data?.officerRemarksR || data?.officerRemarks) && (
          <View style={styles.remarksSection}>
            <Text style={styles.sectionTitle}>Officer Remarks</Text>
            {Object.entries(data?.officerRemarksR || data?.officerRemarks).map(([key, value]) => {
              if (key.toLowerCase().includes('date') || key.toLowerCase().includes('file')) return null;
              const dateKey = key.replace(/Remarks|Reamarks/, 'SubmitDate');
              const dateValue = (data?.officerRemarksR || data?.officerRemarks)[dateKey];
              return (
                <View key={key} style={styles.remarksRow}>
                  <Text style={styles.remarksLabel}>{formatFieldName(key)}:</Text>
                  <Text style={styles.remarksValue}>
                    {value?.toString().trim() || 'N/A'}
                    {dateValue ? ` (${formatDate(dateValue)})` : ''}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        <View style={{ position: 'absolute', bottom: 20, left: 15, right: 15 }}>
          <Text style={{ fontSize: 7, textAlign: 'center' }}>
            Generated on {new Date().toLocaleDateString('en-GB')} | Ref ID: {safe(data?.refId)} | Status:{' '}
            {safe(data?.currentStatus)}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default EmployeeLeavePDF;
