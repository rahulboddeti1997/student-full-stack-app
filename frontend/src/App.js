import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentList from './components/StudentList';
import { Button, Card, Form, Input, Slider, Space } from 'antd';

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchStudents();
  }, [page]); 

  const fetchStudents = () => {
    setLoading(true);
    const { name, age, grade } = form.getFieldsValue();
    let url = `http://localhost:5000/api/students?pageNo=${page}&pageSize=10`;
    if (name) {
      url += `&name=${name}`;
    }
    if (age) {
      url += `&ageMin=${age[0]}&ageMax=${age[1]}`;
    }
    if (grade) {
      url += `&grade=${grade}`;
    }
    axios.get(url)
      .then(response => {
        setStudents(response.data);
        setTotalPages(Math.ceil(response.headers['x-total-count'] / 10));
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  };

  const handleSearch = () => {
    setPage(1); 
    fetchStudents(); 
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePrevPage = () => {
    setPage(page - 1);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Card className="App" style={{width: '50%', margin: 50, textAlign: 'center'}}>
      <h1>Student List</h1>
      <Form style={{display: 'flex', flexDirection: 'row', gap: 30}} onFinish={handleSearch} form={form}>
        <Form.Item name='name'>
          <Input placeholder='Enter the name to search'/>
        </Form.Item>
        <Form.Item name='age'>
        <Slider range defaultValue={[20, 50]} style={{width: 250}} />
        </Form.Item>
        <Form.Item name='grade'>
          <Input placeholder='Enter the grade'/>
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit' >Search</Button>
        </Form.Item>
      </Form>
      <StudentList students={students} />
      <Space style={{marginTop: 10, float: 'right'}}>
        <Button onClick={handlePrevPage} disabled={page === 1}>Previous</Button>
        <Button onClick={handleNextPage} disabled={page === totalPages}>Next</Button>
      </Space>
    </Card>
  );
}

export default App;
