import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import LeaveRequestForm from './components/LeaveRequestForm';
import ApprovalFlow from './components/ApprovalFlow';
import Dashboard from './components/Dashboard';
import { v4 as uuidv4 } from 'uuid';

const AppContainer = styled.div`
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 30px;
  color: white;
  
  h1 {
    font-size: 2.5rem;
    margin: 0;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  p {
    font-size: 1.2rem;
    margin: 10px 0 0 0;
    opacity: 0.9;
  }
`;

const ContentContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 30px;
  align-items: start;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const Tab = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background: ${props => props.active ? '#fff' : 'rgba(255, 255, 255, 0.2)'};
  color: ${props => props.active ? '#333' : '#fff'};
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? '#fff' : 'rgba(255, 255, 255, 0.3)'};
  }
`;

function App() {
  const [activeTab, setActiveTab] = useState('flow');
  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: 'demo-1',
      employeeName: 'Ahmet Yılmaz',
      employeeEmail: 'ahmet.yilmaz@sirket.com',
      startDate: '2024-03-01',
      endDate: '2024-03-05',
      reason: 'Aile ziyareti',
      status: 'pending',
      currentStep: 'manager',
      managerEmail: 'mehmet.manager@sirket.com',
      directorEmail: 'ali.director@sirket.com',
      submittedAt: new Date().toISOString(),
      flowHistory: [
        {
          step: 'submitted',
          timestamp: new Date().toISOString(),
          status: 'completed',
          note: 'İzin talebi gönderildi'
        }
      ]
    }
  ]);

  const handleNewLeaveRequest = useCallback(async (requestData) => {
    const newRequest = {
      id: uuidv4(),
      ...requestData,
      status: 'pending',
      currentStep: 'manager',
      submittedAt: new Date().toISOString(),
      flowHistory: [
        {
          step: 'submitted',
          timestamp: new Date().toISOString(),
          status: 'completed',
          note: 'İzin talebi gönderildi'
        }
      ]
    };
    
    setLeaveRequests(prev => [newRequest, ...prev]);
    
    // Amir'e email gönder
    try {
      const EmailService = (await import('./services/EmailService')).default;
      await EmailService.sendInitialRequestEmail(requestData.managerEmail, requestData);
    } catch (error) {
      console.error('Email gönderim hatası:', error);
    }
  }, []);

  const handleUpdateRequest = useCallback((requestId, updates) => {
    setLeaveRequests(prev =>
      prev.map(request =>
        request.id === requestId
          ? { ...request, ...updates }
          : request
      )
    );
  }, []);

  return (
    <AppContainer>
      <Header>
        <h1>🏖️ Yıllık İzin Onay Sistemi</h1>
        <p>İzin taleplerini görsel akış ile yönetin</p>
      </Header>
      
      <TabContainer>
        <Tab 
          active={activeTab === 'flow'} 
          onClick={() => setActiveTab('flow')}
        >
          📊 Onay Akışı
        </Tab>
        <Tab 
          active={activeTab === 'dashboard'} 
          onClick={() => setActiveTab('dashboard')}
        >
          📋 İzin Talepleri
        </Tab>
      </TabContainer>

      <ContentContainer>
        <LeaveRequestForm onSubmit={handleNewLeaveRequest} />
        
        {activeTab === 'flow' ? (
          <ApprovalFlow 
            requests={leaveRequests}
            onUpdateRequest={handleUpdateRequest}
          />
        ) : (
          <Dashboard 
            requests={leaveRequests}
            onUpdateRequest={handleUpdateRequest}
          />
        )}
      </ContentContainer>
    </AppContainer>
  );
}

export default App;