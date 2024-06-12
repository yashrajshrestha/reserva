import React, { useEffect, useState } from 'react';
import { Button, Modal, Typography, Form, Input, DatePicker, Table, Spin, Popconfirm } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { addEvent, deleteEvent, fetchEvents, updateEvent } from '../reducers/eventsSlice'; // Update with your actual action import
import dayjs from 'dayjs';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const CustomModals = ({ visible, onCancel, item }) => {
  
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [visibleModal, setVisibleModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!visible) {
      setVisibleModal(false); // Reset visibleModal to false when the modal is closed
      form.resetFields();
    }
  }, [visible]);

  const onFinish = async (values) => {
    try {
      setIsLoading(true); // Set loading state to true
      const { id, title, dateRange, description, participants } = values;
      const [start_date, end_date] = dateRange;
      const year = item?.date.year();
      const month = item?.date.month() + 1;

      const eventData = {
        id,
        title,
        start_date: start_date.format('YYYY-MM-DD'),
        end_date: end_date.format('YYYY-MM-DD'),
        description,
        year,
        month,
        participants: participants.filter(email => email).map(email => email.trim()),
      };
      console.log('Submitted event data:', eventData);

      if(id){
        await dispatch(updateEvent(eventData));
      }else {
        await dispatch(addEvent(eventData));
      }

      dispatch(fetchEvents({ month, year }));
      setIsLoading(false); // Set loading state to false after successful submission
      onCancel(); // Close the modal after form submission
    } catch (error) {
      console.error('Error submitting event data:', error);
      setIsLoading(false); // Set loading state to false in case of error
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Start Date',
      dataIndex: 'start_date',
      key: 'start_date',
    },
    {
      title: 'End Date',
      dataIndex: 'end_date',
      key: 'end_date',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    }
  ];


  const handleDelete = async (id) => {
    const year = item?.date.year();
    const month = item?.date.month();
    setIsLoading(true);
    await dispatch(deleteEvent(id));
    dispatch(fetchEvents({ month, year }));
    setIsLoading(false); // Set loading state to false after successful submission
    onCancel();
  };

  const handleRowClick = (event) => {
    
    setVisibleModal(true);
    form.setFieldsValue({
      id: event.id,
      title: event.title,
      dateRange: [dayjs(event.start_date), dayjs(event.end_date)],
      description: event.description,
      participants: event.participants,
    });
  };

  return (
    <Modal
      title={`You selected date: ${item?.date?.format('YYYY-MM-DD')}`}
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
       {isLoading ? ( // Show loading spinner if isLoading is true
        <Spin size="large" />
      ) : (
        <>
      {item && item.events && item.events.length > 0 && !visibleModal ? (
        <>
        <Button type="primary" onClick={() => {
          setVisibleModal(true);
          form.resetFields();
        }}>
          Create Event
        </Button>
        <Table 
          dataSource={item.events} 
          columns={columns}  
          rowKey="id"
          onRow={(record, rowIndex) => {
            return {
              onClick: () => handleRowClick(record),
            };
          }}
        />
        </>
      ) : (
      <>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
                name="id"
                noStyle
              >
                <Input type="hidden" />
              </Form.Item>
        <Form.Item
          label="Event Title"
          name="title"
          rules={[{ required: true, message: 'Please input your event title!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Date Range"
          name="dateRange"
          rules={[{ required: true, message: 'Please select date range!' }]}
        >
          <RangePicker/>
        </Form.Item>

        <Form.Item
          label="Event Description"
          name="description"
          rules={[{ required: true, message: 'Please input your description!' }]}
        >
          <TextArea rows={4} />
        </Form.Item>

        <Form.List name="participants">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item
                  key={field.key} // Directly passing the key prop
                  label={index === 0 ? 'Participants' : ''}
                >
                  <Form.Item
                    {...field}
                    validateTrigger={['onChange', 'onBlur']}
                    rules={[
                      { required: true, whitespace: true, message: 'Please input participant\'s email!' },
                      { type: 'email', message: 'Please enter a valid email!' }
                    ]}
                    noStyle
                  >
                    <Input placeholder="Participant's Email" style={{ width: '60%' }}/>
                  </Form.Item>
                  {fields.length > 1 ? (
                  <MinusCircleOutlined
                    className="dynamic-delete-button"
                    onClick={() => remove(field.name)}
                  />
                ) : null}
                </Form.Item>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  style={{ width: '60%' }}
                  icon={<PlusOutlined />}
                >
                  Add Participant
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          {form.getFieldValue('id') && (<div style={{ float: 'right' }}>
          <Button type="primary" danger onClick={() => handleDelete(form.getFieldValue('id'))}>
          Delete
        </Button>
        </div>)}
        </Form.Item>
      </Form>
    </>
      )}
      </>
    )}
    </Modal>
  );
};

export default CustomModals;
