import React, { useCallback, useMemo, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import styled from 'styled-components';
import CustomNode from './CustomNode';
import RequestSelector from './RequestSelector';
import EmailService from '../services/EmailService';

const FlowContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  height: 600px;
`;

const FlowHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const FlowTitle = styled.h2`
  color: #333;
  margin: 0;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const StatusBadge = styled.div`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  
  ${props => {
    switch(props.status) {
      case 'pending':
        return 'background: #fff3cd; color: #856404; border: 1px solid #ffeaa7;';
      case 'approved':
        return 'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;';
      case 'rejected':
        return 'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;';
      default:
        return 'background: #e2e3e5; color: #383d41; border: 1px solid #d6d8db;';
    }
  }}
`;

const FlowContent = styled.div`
  height: 520px;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  overflow: hidden;
`;

const nodeTypes = {
  custom: CustomNode,
};

function ApprovalFlow({ requests, onUpdateRequest }) {
  const [selectedRequestId, setSelectedRequestId] = useState(requests[0]?.id || null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const selectedRequest = useMemo(() => {
    return requests.find(req => req.id === selectedRequestId);
  }, [requests, selectedRequestId]);

  // Seçilen talebe göre akış düğümlerini oluştur
  const generateFlowNodes = useCallback((request) => {
    if (!request) return { nodes: [], edges: [] };

    const baseY = 100;
    const spacing = 200;

    const flowNodes = [
      {
        id: 'start',
        type: 'custom',
        position: { x: 100, y: baseY },
        data: {
          label: '🚀 Talep Başlatıldı',
          status: 'completed',
          description: `${request.employeeName} tarafından gönderildi`,
          email: request.employeeEmail,
          timestamp: request.submittedAt,
          isActive: false
        }
      },
      {
        id: 'manager',
        type: 'custom',
        position: { x: 100 + spacing, y: baseY },
        data: {
          label: '👨‍💼 Amir Onayı',
          status: request.currentStep === 'manager' ? 'pending' : 
                  request.status === 'approved' || request.currentStep === 'director' ? 'completed' : 
                  request.status === 'rejected' && request.currentStep === 'manager' ? 'rejected' : 'pending',
          description: 'Doğrudan amir onayı bekleniyor',
          email: request.managerEmail,
          timestamp: request.flowHistory?.find(h => h.step === 'manager')?.timestamp,
          isActive: request.currentStep === 'manager',
          onApprove: () => handleApproval(request.id, 'manager', 'approved'),
          onReject: () => handleApproval(request.id, 'manager', 'rejected')
        }
      },
      {
        id: 'director',
        type: 'custom',
        position: { x: 100 + spacing * 2, y: baseY },
        data: {
          label: '👔 Üst Amir Onayı',
          status: request.currentStep === 'director' ? 'pending' : 
                  request.status === 'approved' ? 'completed' : 
                  request.status === 'rejected' && request.currentStep === 'director' ? 'rejected' : 'waiting',
          description: 'Üst amir final onayı',
          email: request.directorEmail,
          timestamp: request.flowHistory?.find(h => h.step === 'director')?.timestamp,
          isActive: request.currentStep === 'director',
          onApprove: () => handleApproval(request.id, 'director', 'approved'),
          onReject: () => handleApproval(request.id, 'director', 'rejected')
        }
      },
      {
        id: 'completed',
        type: 'custom',
        position: { x: 100 + spacing * 3, y: baseY },
        data: {
          label: request.status === 'approved' ? '✅ Onaylandı' : 
                request.status === 'rejected' ? '❌ Reddedildi' : '⏳ Beklemede',
          status: request.status === 'approved' ? 'completed' : 
                  request.status === 'rejected' ? 'rejected' : 'waiting',
          description: request.status === 'approved' ? 'İzin talebi onaylandı' : 
                      request.status === 'rejected' ? 'İzin talebi reddedildi' : 'Süreç devam ediyor',
          timestamp: request.status !== 'pending' ? new Date().toISOString() : null,
          isActive: false
        }
      }
    ];

    // Red durumunda geri dönüş düğümü ekle
    if (request.status === 'rejected') {
      flowNodes.push({
        id: 'rejected-return',
        type: 'custom',
        position: { x: 100 + spacing, y: baseY + 150 },
        data: {
          label: '🔄 Geri Dönüş',
          status: 'active',
          description: 'Talep geri döndürüldü',
          isActive: true
        }
      });
    }

    // Kenarları oluştur
    const flowEdges = [
      {
        id: 'e1',
        source: 'start',
        target: 'manager',
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { strokeWidth: 2, stroke: '#667eea' }
      },
      {
        id: 'e2',
        source: 'manager',
        target: 'director',
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { 
          strokeWidth: 2, 
          stroke: request.currentStep === 'director' || request.status === 'approved' ? '#28a745' : '#6c757d',
          strokeDasharray: request.currentStep === 'director' || request.status === 'approved' ? '0' : '5,5'
        }
      },
      {
        id: 'e3',
        source: 'director',
        target: 'completed',
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { 
          strokeWidth: 2, 
          stroke: request.status === 'approved' ? '#28a745' : '#6c757d',
          strokeDasharray: request.status === 'approved' ? '0' : '5,5'
        }
      }
    ];

    // Red durumunda geri dönüş kenarları
    if (request.status === 'rejected') {
      if (request.currentStep === 'manager') {
        flowEdges.push({
          id: 'e-reject-manager',
          source: 'manager',
          target: 'rejected-return',
          markerEnd: { type: MarkerType.ArrowClosed },
          style: { strokeWidth: 2, stroke: '#dc3545' }
        });
      } else if (request.currentStep === 'director') {
        flowEdges.push({
          id: 'e-reject-director',
          source: 'director',
          target: 'rejected-return',
          markerEnd: { type: MarkerType.ArrowClosed },
          style: { strokeWidth: 2, stroke: '#dc3545' }
        });
        flowEdges.push({
          id: 'e-return-manager',
          source: 'rejected-return',
          target: 'manager',
          markerEnd: { type: MarkerType.ArrowClosed },
          style: { strokeWidth: 2, stroke: '#ffc107' }
        });
      }
    }

    return { nodes: flowNodes, edges: flowEdges };
  }, []);

  // Onay/Red işlemlerini yönet
  const handleApproval = useCallback(async (requestId, step, action) => {
    const request = requests.find(req => req.id === requestId);
    if (!request) return;

    let updates = {
      flowHistory: [
        ...request.flowHistory,
        {
          step,
          timestamp: new Date().toISOString(),
          status: action,
          note: `${step === 'manager' ? 'Amir' : 'Üst amir'} tarafından ${action === 'approved' ? 'onaylandı' : 'reddedildi'}`
        }
      ]
    };

    if (action === 'approved') {
      if (step === 'manager') {
        updates.currentStep = 'director';
        // Amir onayladı, üst amire email gönder
        await EmailService.sendApprovalEmail(request.directorEmail, {
          employeeName: request.employeeName,
          startDate: request.startDate,
          endDate: request.endDate,
          reason: request.reason,
          step: 'director'
        });
      } else if (step === 'director') {
        updates.status = 'approved';
        updates.currentStep = 'completed';
        // Üst amir onayladı, çalışana onay emaili gönder
        await EmailService.sendNotificationEmail(request.employeeEmail, {
          employeeName: request.employeeName,
          startDate: request.startDate,
          endDate: request.endDate,
          status: 'approved'
        });
      }
    } else if (action === 'rejected') {
      if (step === 'director') {
        // Üst amir reddetti, amir'e geri dön
        updates.currentStep = 'manager';
        // Amire red bildirimi gönder
        await EmailService.sendRejectionEmail(request.managerEmail, {
          employeeName: request.employeeName,
          startDate: request.startDate,
          endDate: request.endDate,
          rejectedBy: 'director'
        });
      } else {
        // Amir reddetti, süreci sonlandır
        updates.status = 'rejected';
        updates.currentStep = 'rejected';
        // Çalışana red emaili gönder
        await EmailService.sendNotificationEmail(request.employeeEmail, {
          employeeName: request.employeeName,
          startDate: request.startDate,
          endDate: request.endDate,
          status: 'rejected'
        });
      }
    }

    onUpdateRequest(requestId, updates);
  }, [requests, onUpdateRequest]);

  // Düğümleri ve kenarları güncelle
  React.useEffect(() => {
    if (selectedRequest) {
      const { nodes: newNodes, edges: newEdges } = generateFlowNodes(selectedRequest);
      setNodes(newNodes);
      setEdges(newEdges);
    }
  }, [selectedRequest, generateFlowNodes, setNodes, setEdges]);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <FlowContainer>
      <FlowHeader>
        <FlowTitle>
          🔄 Onay Akışı
        </FlowTitle>
        {selectedRequest && (
          <StatusBadge status={selectedRequest.status}>
            {selectedRequest.status === 'pending' ? 'Beklemede' :
             selectedRequest.status === 'approved' ? 'Onaylandı' : 'Reddedildi'}
          </StatusBadge>
        )}
      </FlowHeader>
      
      <RequestSelector
        requests={requests}
        selectedRequestId={selectedRequestId}
        onSelectRequest={setSelectedRequestId}
      />
      
      <FlowContent>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
        >
          <Controls />
          <MiniMap 
            nodeStrokeColor="#333"
            nodeColor="#fff"
            nodeBorderRadius={8}
            maskColor="rgba(0, 0, 0, 0.1)"
          />
          <Background variant="dots" gap={20} size={1} color="#e1e5e9" />
        </ReactFlow>
      </FlowContent>
    </FlowContainer>
  );
}

export default ApprovalFlow;