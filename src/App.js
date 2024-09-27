import React from 'react';
import { Layout } from 'antd';
import Sidebar from './components/Sidebar'; // Assuming Sidebar is in the same directory
import CustomCalendar from './components/CustomCalender'; // Import your CustomCalendar component

const { Header, Content } = Layout;

function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      
      <Layout>

        <Sidebar />
        <Header className="site-layout-background" style={{ padding: 0 }}>
          <h1 style={{ color: 'white' }}>Reserva</h1>
        </Header>

        <Content style={{ margin: '16px' }}>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
            <CustomCalendar />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;