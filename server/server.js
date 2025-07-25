const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Gmail için email transporter (gerçek kullanımda .env dosyasında saklanmalı)
const createTransporter = () => {
  // Demo amaçlı basit SMTP ayarları
  // Gerçek kullanımda Gmail, Outlook, SendGrid vb. kullanılabilir
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'demo@company.com',
      pass: process.env.EMAIL_PASS || 'demo-password'
    }
  });
};

// Email şablonları
const emailTemplates = {
  approvalRequest: (requestData) => ({
    subject: `🏖️ Yıllık İzin Onay Talebi - ${requestData.employeeName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #667eea; text-align: center;">🏖️ Yıllık İzin Onay Talebi</h2>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Talep Detayları</h3>
          <p><strong>👤 Çalışan:</strong> ${requestData.employeeName}</p>
          <p><strong>📅 İzin Tarihleri:</strong> ${requestData.startDate} - ${requestData.endDate}</p>
          <p><strong>💭 Sebep:</strong> ${requestData.reason}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <p style="font-size: 16px; color: #555;">Bu izin talebini onaylamak veya reddetmek için lütfen sisteme giriş yapınız.</p>
          <div style="margin: 20px 0;">
            <a href="http://localhost:3000" style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 0 10px; display: inline-block;">✅ Sisteme Git</a>
          </div>
        </div>
        
        <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
          <p>Bu email otomatik olarak gönderilmiştir. Lütfen cevap vermeyiniz.</p>
          <p>© 2024 Şirket İzin Yönetim Sistemi</p>
        </div>
      </div>
    `
  }),

  approvalNotification: (requestData) => ({
    subject: `✅ İzin Talebiniz Onaylandı - ${requestData.employeeName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #28a745; text-align: center;">✅ İzin Talebiniz Onaylandı!</h2>
        
        <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #c3e6cb;">
          <h3 style="color: #155724; margin-top: 0;">Onaylanan İzin Detayları</h3>
          <p><strong>👤 Çalışan:</strong> ${requestData.employeeName}</p>
          <p><strong>📅 İzin Tarihleri:</strong> ${requestData.startDate} - ${requestData.endDate}</p>
          <p><strong>🎉 Durum:</strong> Onaylandı</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <p style="font-size: 16px; color: #155724; font-weight: bold;">Harika! İzin talebiniz onaylanmıştır.</p>
          <p style="color: #555;">İyi tatiller geçirmenizi dileriz! 🏖️</p>
        </div>
        
        <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
          <p>Bu email otomatik olarak gönderilmiştir. Lütfen cevap vermeyiniz.</p>
          <p>© 2024 Şirket İzin Yönetim Sistemi</p>
        </div>
      </div>
    `
  }),

  rejectionNotification: (requestData) => ({
    subject: `❌ İzin Talebiniz Hakkında - ${requestData.employeeName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #dc3545; text-align: center;">📋 İzin Talebi Durumu</h2>
        
        <div style="background: #f8d7da; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #f5c6cb;">
          <h3 style="color: #721c24; margin-top: 0;">Talep Detayları</h3>
          <p><strong>👤 Çalışan:</strong> ${requestData.employeeName}</p>
          <p><strong>📅 İzin Tarihleri:</strong> ${requestData.startDate} - ${requestData.endDate}</p>
          <p><strong>📍 Durum:</strong> ${requestData.status === 'rejected' ? 'Reddedildi' : 'Gözden Geçiriliyor'}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <p style="font-size: 16px; color: #721c24;">
            ${requestData.status === 'rejected' ? 
              'Maalesef izin talebiniz reddedilmiştir.' : 
              'İzin talebiniz tekrar değerlendirme için gönderilmiştir.'
            }
          </p>
          <p style="color: #555;">Detaylar için lütfen amirinizle görüşünüz.</p>
        </div>
        
        <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
          <p>Bu email otomatik olarak gönderilmiştir. Lütfen cevap vermeyiniz.</p>
          <p>© 2024 Şirket İzin Yönetim Sistemi</p>
        </div>
      </div>
    `
  }),

  managerRejectionNotice: (requestData) => ({
    subject: `🔄 İzin Talebi Geri Döndürüldü - ${requestData.employeeName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #ffc107; text-align: center;">🔄 Üst Amir Tarafından Geri Döndürüldü</h2>
        
        <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #ffeaa7;">
          <h3 style="color: #856404; margin-top: 0;">Talep Detayları</h3>
          <p><strong>👤 Çalışan:</strong> ${requestData.employeeName}</p>
          <p><strong>📅 İzin Tarihleri:</strong> ${requestData.startDate} - ${requestData.endDate}</p>
          <p><strong>📍 Durum:</strong> Üst amir tarafından geri döndürüldü</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <p style="font-size: 16px; color: #856404;">Bu izin talebi üst amir tarafından size geri döndürülmüştür.</p>
          <p style="color: #555;">Lütfen talebi tekrar değerlendirerek onaylayın veya reddedin.</p>
          <div style="margin: 20px 0;">
            <a href="http://localhost:3000" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">🔄 Sisteme Git</a>
          </div>
        </div>
        
        <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
          <p>Bu email otomatik olarak gönderilmiştir. Lütfen cevap vermeyiniz.</p>
          <p>© 2024 Şirket İzin Yönetim Sistemi</p>
        </div>
      </div>
    `
  })
};

// Email gönderme fonksiyonu
const sendEmail = async (to, template) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"İzin Yönetim Sistemi" <${process.env.EMAIL_USER || 'system@company.com'}>`,
      to: to,
      subject: template.subject,
      html: template.html
    };

    // Demo amaçlı - gerçek email göndermek yerine konsola log at
    console.log('📧 EMAIL GÖNDERİLDİ:');
    console.log('📨 Alıcı:', to);
    console.log('📄 Konu:', template.subject);
    console.log('📝 İçerik HTML uzunluğu:', template.html.length, 'karakter');
    
    // Gerçek email gönderimi için aşağıdaki satırı aktif edin:
    // const result = await transporter.sendMail(mailOptions);
    
    // Demo için başarılı response döndür
    return {
      success: true,
      messageId: 'demo-' + Date.now(),
      recipient: to
    };
    
  } catch (error) {
    console.error('Email gönderim hatası:', error);
    throw error;
  }
};

// API Routes

// İlk talep emaili (amir'e)
app.post('/api/send-initial-request-email', async (req, res) => {
  try {
    const { to, requestData } = req.body;
    const template = emailTemplates.approvalRequest(requestData);
    const result = await sendEmail(to, template);
    
    res.json({
      success: true,
      message: 'İlk talep emaili gönderildi',
      result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Email gönderim hatası',
      error: error.message
    });
  }
});

// Onay emaili (bir sonraki onaylayıcıya)
app.post('/api/send-approval-email', async (req, res) => {
  try {
    const { to, requestData } = req.body;
    const template = emailTemplates.approvalRequest({
      ...requestData,
      step: requestData.step === 'director' ? 'üst amir onayı' : 'amir onayı'
    });
    const result = await sendEmail(to, template);
    
    res.json({
      success: true,
      message: 'Onay emaili gönderildi',
      result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Email gönderim hatası',
      error: error.message
    });
  }
});

// Red emaili (geri döndürme)
app.post('/api/send-rejection-email', async (req, res) => {
  try {
    const { to, requestData } = req.body;
    
    let template;
    if (requestData.rejectedBy === 'director') {
      // Üst amir reddetti, amir'e geri döndürme emaili
      template = emailTemplates.managerRejectionNotice(requestData);
    } else {
      // Amir reddetti, çalışana red emaili
      template = emailTemplates.rejectionNotification({
        ...requestData,
        status: 'rejected'
      });
    }
    
    const result = await sendEmail(to, template);
    
    res.json({
      success: true,
      message: 'Red emaili gönderildi',
      result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Email gönderim hatası',
      error: error.message
    });
  }
});

// Bildirim emaili (çalışana onay/red bildirimi)
app.post('/api/send-notification-email', async (req, res) => {
  try {
    const { to, requestData } = req.body;
    
    const template = requestData.status === 'approved' 
      ? emailTemplates.approvalNotification(requestData)
      : emailTemplates.rejectionNotification(requestData);
      
    const result = await sendEmail(to, template);
    
    res.json({
      success: true,
      message: 'Bildirim emaili gönderildi',
      result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Email gönderim hatası',
      error: error.message
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Email service is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: error.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Email servisi çalışıyor: http://localhost:${PORT}`);
  console.log(`📧 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;