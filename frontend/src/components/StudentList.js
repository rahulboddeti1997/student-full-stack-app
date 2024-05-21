import React from 'react';
import { Table } from 'antd';

function StudentList({ students }) {
  return (
    <Table dataSource={students} columns={[{ title: 'Name', dataIndex: 'name', key: 'name' }, { title: 'Age', dataIndex: 'age', key: 'age' }, { title: 'Grade', dataIndex: 'grade', key: 'grade' }]} pagination={false} />
  );
}

export default StudentList;
