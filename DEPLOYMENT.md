# 🚀 Deployment Guide - Yıllık İzin Onay Sistemi

Bu dokümanda uygulamanın farklı ortamlara nasıl deploy edileceği açıklanmaktadır.

## 📦 Production Build

### Frontend Build
```bash
# React uygulamasını production için build et
npm run build

# Build dosyaları build/ klasöründe oluşur
ls build/
```

### Backend Production
```bash
# Production ortamı için environment değişkenleri
NODE_ENV=production
PORT=8080
EMAIL_USER=your-production-email@company.com
EMAIL_PASS=your-production-password
```

## 🌐 Deployment Seçenekleri

### 1. Vercel (Frontend)
```bash
# Vercel CLI kurulumu
npm install -g vercel

# Deploy
vercel

# Environment variables Vercel dashboard'dan ekle:
# REACT_APP_API_URL=https://your-backend-url.com
```

### 2. Heroku (Full Stack)
```bash
# Heroku CLI ile
heroku create annual-leave-app
heroku config:set NODE_ENV=production
heroku config:set EMAIL_USER=your-email@gmail.com
heroku config:set EMAIL_PASS=your-app-password

# Deploy
git push heroku main
```

### 3. Digital Ocean / AWS EC2
```bash
# Server setup
sudo apt update
sudo apt install nodejs npm nginx

# Application setup
git clone your-repo
cd annual-leave-approval-flow
npm install
npm run build

# PM2 ile process management
npm install -g pm2
pm2 start server/server.js --name "leave-api"
pm2 start npm --name "leave-app" -- start

# Nginx reverse proxy
sudo nano /etc/nginx/sites-available/leave-app
```

### 4. Docker Deployment
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000 3001

CMD ["npm", "run", "dev"]
```

```bash
# Docker build & run
docker build -t leave-approval-system .
docker run -p 3000:3000 -p 3001:3001 leave-approval-system
```

## 🔧 Environment Variables

### Required Variables
```env
# API Configuration
NODE_ENV=production
PORT=8080
REACT_APP_API_URL=https://your-api-domain.com

# Email Configuration
EMAIL_USER=your-email@company.com
EMAIL_PASS=your-secure-password

# Database (future)
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Security (future)
JWT_SECRET=your-jwt-secret
SESSION_SECRET=your-session-secret
```

## 📊 Monitoring & Logging

### Application Monitoring
```bash
# PM2 monitoring
pm2 monit

# Logs
pm2 logs
pm2 logs leave-api
pm2 logs leave-app
```

### Email Service Monitoring
```javascript
// Add to server.js
app.get('/api/metrics', (req, res) => {
  res.json({
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    emailsSent: global.emailsSent || 0,
    errors: global.emailErrors || 0
  });
});
```

## 🔒 Security Checklist

### Frontend Security
- [ ] Environment variables doğru set edildi
- [ ] API endpoints HTTPS kullanıyor
- [ ] Sensitive data localStorage'da saklanmıyor
- [ ] XSS korumaları aktif

### Backend Security
- [ ] Email credentials güvenli saklanıyor
- [ ] Rate limiting implementasyonu
- [ ] CORS ayarları production için yapılandırıldı
- [ ] Input validation aktif
- [ ] HTTPS zorlanıyor

## 📈 Performance Optimizations

### Frontend
```javascript
// React.lazy ile code splitting
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const ApprovalFlow = React.lazy(() => import('./components/ApprovalFlow'));

// Service Worker ile caching
// PWA functionality
```

### Backend
```javascript
// Redis caching for frequent queries
// Database connection pooling
// Gzip compression
app.use(compression());

// Static file serving
app.use(express.static('build'));
```

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - run: npm install
    - run: npm run build
    - run: npm test
    
    # Deploy to your preferred platform
```

## 🆘 Troubleshooting

### Common Issues
1. **Email not sending**: Check SMTP credentials
2. **Port conflicts**: Verify PORT environment variable
3. **Build failures**: Clear node_modules and reinstall
4. **CORS errors**: Update backend CORS configuration

### Debug Commands
```bash
# Check running processes
ps aux | grep node

# Check port usage
netstat -tulpn | grep :3000
netstat -tulpn | grep :3001

# View logs
tail -f /var/log/nginx/error.log
pm2 logs --lines 100
```

## 📱 Mobile Responsiveness

Uygulama responsive tasarıma sahiptir:
- ✅ Mobile viewport optimization
- ✅ Touch-friendly UI elements
- ✅ Flexible grid layout
- ✅ Readable fonts on small screens

## 🔮 Future Enhancements

### Database Integration
- PostgreSQL/MySQL database
- User authentication system
- Role-based permissions
- Data persistence

### Advanced Features
- Push notifications
- Calendar integration
- Slack/Teams integration
- Advanced reporting
- Multi-language support

---

**📞 Support**: Bu deployment guide ile ilgili sorularınız için GitHub Issues açabilirsiniz.