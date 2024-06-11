import React from 'react';
import { Button, Modal, Typography, Form, Input, DatePicker } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { addEvent } from '../reducers/eventsSlice'; // Update with your actual action import

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const CustomModals = ({ visible, onCancel, item }) => {
  
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const onFinish = (values) => {
    const { title, dateRange, description, participants } = values;
    const [start_date, end_date] = dateRange;
    const year = item?.date.year();
    const month = item?.date.month();

    const eventData = {
      title,
      start_date: start_date.format('YYYY-MM-DD'),
      end_date: end_date.format('YYYY-MM-DD'),
      description,
      year,
      month,
      participants: participants.filter(email => email).map(email => email.trim()),
    };
    console.log('Submitted event data:', eventData);
    dispatch(addEvent(eventData)); // Assuming you have an action like 'addEvent' to dispatch
    onCancel(); // Close the modal after form submission
  };

  return (
    <Modal
      title={`You selected date: ${item?.date?.format('YYYY-MM-DD')}`}
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
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
          <RangePicker />
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
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CustomModals;
