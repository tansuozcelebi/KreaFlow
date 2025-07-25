#!/usr/bin/env node

/**
 * Demo Script - Yıllık İzin Onay Sistemi
 * Bu script demo amaçlı örnek verileri oluşturur ve onay sürecini simüle eder
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001';

// Demo verileri
const demoRequests = [
  {
    employeeName: 'Ayşe Demir',
    employeeEmail: 'ayse.demir@sirket.com',
    startDate: '2024-08-01',
    endDate: '2024-08-15',
    reason: 'Yaz tatili planlarım için aile ile birlikte deniz kenarında geçireceğim uzun bir tatil',
    managerEmail: 'ali.manager@sirket.com',
    directorEmail: 'mehmet.director@sirket.com'
  },
  {
    employeeName: 'Can Özkan',
    employeeEmail: 'can.ozkan@sirket.com',
    startDate: '2024-07-20',
    endDate: '2024-07-25',
    reason: 'Evlilik yıldönümümüz için eşimle birlikte özel bir tatil planladık',
    managerEmail: 'zeynep.manager@sirket.com',
    directorEmail: 'mehmet.director@sirket.com'
  },
  {
    employeeName: 'Elif Kaya',
    employeeEmail: 'elif.kaya@sirket.com',
    startDate: '2024-09-10',
    endDate: '2024-09-12',
    reason: 'Kişisel işlerimi halletmek ve dinlenmek için kısa bir mola',
    managerEmail: 'ali.manager@sirket.com',
    directorEmail: 'fatma.director@sirket.com'
  }
];

// Email gönderim testi
async function testEmailSending() {
  console.log('📧 Email gönderim sistemi test ediliyor...\n');
  
  try {
    // Health check
    const healthResponse = await axios.get(`${API_BASE_URL}/api/health`);
    console.log('✅ Backend servisi çalışıyor:', healthResponse.data.message);
    
    // Test email gönderimi
    const testEmailData = {
      to: 'test@sirket.com',
      requestData: demoRequests[0]
    };
    
    const emailResponse = await axios.post(`${API_BASE_URL}/api/send-initial-request-email`, testEmailData);
    console.log('✅ Email servisi test edildi:', emailResponse.data.message);
    
  } catch (error) {
    console.error('❌ Email servisi hatası:', error.message);
  }
}

// Demo senaryoları
async function runDemoScenarios() {
  console.log('🎭 Demo senaryoları çalıştırılıyor...\n');
  
  // Senaryo 1: Tam onay süreci
  console.log('📋 Senaryo 1: Tam Onay Süreci');
  console.log('   Çalışan: Ayşe Demir');
  console.log('   Amir: Ali Manager → Onaylar');
  console.log('   Üst Amir: Mehmet Director → Onaylar');
  console.log('   Sonuç: ONAYLANDI ✅\n');
  
  // Senaryo 2: Amir reddi
  console.log('📋 Senaryo 2: Amir Reddi');
  console.log('   Çalışan: Can Özkan');
  console.log('   Amir: Zeynep Manager → Reddeder');
  console.log('   Sonuç: REDDEDİLDİ ❌\n');
  
  // Senaryo 3: Üst amir reddi ve geri dönüş
  console.log('📋 Senaryo 3: Üst Amir Reddi ve Geri Dönüş');
  console.log('   Çalışan: Elif Kaya');
  console.log('   Amir: Ali Manager → Onaylar');
  console.log('   Üst Amir: Fatma Director → Reddeder (geri döner)');
  console.log('   Amir: Tekrar değerlendirme');
  console.log('   Sonuç: TEKRAR İNCELEME 🔄\n');
}

// Kullanım kılavuzu
function showUsageGuide() {
  console.log('📖 KULLANIM KILAVUZU');
  console.log('==================\n');
  
  console.log('🚀 Uygulamayı Başlatma:');
  console.log('   npm run dev              # Hem frontend hem backend');
  console.log('   npm start               # Sadece frontend (3000)');
  console.log('   npm run server          # Sadece backend (3001)\n');
  
  console.log('🌐 Erişim Adresleri:');
  console.log('   Frontend: http://localhost:3000');
  console.log('   Backend:  http://localhost:3001');
  console.log('   Health:   http://localhost:3001/api/health\n');
  
  console.log('📝 Adım Adım Test:');
  console.log('   1. Sol panelden yeni izin talebi oluştur');
  console.log('   2. Form bilgilerini doldur (demo emailler kullanabilirsin)');
  console.log('   3. "Onay Akışı" sekmesinde görsel akışı gözlemle');
  console.log('   4. Aktif düğümlerde "Onayla" veya "Reddet" butonlarını kullan');
  console.log('   5. "İzin Talepleri" sekmesinde detayları ve geçmişi incele\n');
  
  console.log('📧 Email Özelliği:');
  console.log('   - Gerçek email gönderim kapalı (demo mode)');
  console.log('   - Konsol loglarında email detaylarını görebilirsin');
  console.log('   - .env dosyasında email ayarlarını yapıp aktif edebilirsin\n');
  
  console.log('🎨 Özelleştirme:');
  console.log('   - src/components/CustomNode.js: Düğüm tasarımı');
  console.log('   - server/server.js: Email şablonları');
  console.log('   - src/components/ApprovalFlow.js: İş akışı kuralları\n');
}

// Ana fonksiyon
async function main() {
  console.log('🏖️  YILLIK İZİN ONAY SİSTEMİ - DEMO SCRIPT\n');
  console.log('===========================================\n');
  
  // Email sistemini test et
  await testEmailSending();
  
  console.log('\n');
  
  // Demo senaryoları göster
  await runDemoScenarios();
  
  // Kullanım kılavuzunu göster
  showUsageGuide();
  
  console.log('🎉 Demo hazır! Uygulamayı http://localhost:3000 adresinden kullanmaya başlayabilirsiniz.\n');
}

// Script'i çalıştır
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Demo script hatası:', error.message);
    process.exit(1);
  });
}

module.exports = { main, testEmailSending, runDemoScenarios, showUsageGuide };