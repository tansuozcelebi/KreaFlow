import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

class EmailService {
  static async sendApprovalEmail(recipientEmail, requestData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/send-approval-email`, {
        to: recipientEmail,
        requestData
      });
      
      console.log('Onay emaili gönderildi:', response.data);
      return response.data;
    } catch (error) {
      console.error('Onay emaili gönderim hatası:', error);
      // Gerçek uygulamada hata yönetimi daha detaylı olmalı
      // Şimdilik konsola log atıyoruz
      throw error;
    }
  }

  static async sendRejectionEmail(recipientEmail, requestData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/send-rejection-email`, {
        to: recipientEmail,
        requestData
      });
      
      console.log('Red emaili gönderildi:', response.data);
      return response.data;
    } catch (error) {
      console.error('Red emaili gönderim hatası:', error);
      throw error;
    }
  }

  static async sendNotificationEmail(recipientEmail, requestData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/send-notification-email`, {
        to: recipientEmail,
        requestData
      });
      
      console.log('Bildirim emaili gönderildi:', response.data);
      return response.data;
    } catch (error) {
      console.error('Bildirim emaili gönderim hatası:', error);
      throw error;
    }
  }

  static async sendInitialRequestEmail(managerEmail, requestData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/send-initial-request-email`, {
        to: managerEmail,
        requestData
      });
      
      console.log('İlk talep emaili gönderildi:', response.data);
      return response.data;
    } catch (error) {
      console.error('İlk talep emaili gönderim hatası:', error);
      throw error;
    }
  }

  // Demo amaçlı - gerçek email gönderimi yerine konsola log atar
  static async sendDemoEmail(type, recipientEmail, requestData) {
    console.log(`📧 DEMO EMAIL - ${type.toUpperCase()}`);
    console.log(`📨 Alıcı: ${recipientEmail}`);
    console.log(`📄 İçerik:`, requestData);
    
    // Gerçek email servisi yokken demo için simüle edelim
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: `Demo email (${type}) başarıyla "gönderildi"`,
          recipient: recipientEmail
        });
      }, 1000);
    });
  }
}

export default EmailService;