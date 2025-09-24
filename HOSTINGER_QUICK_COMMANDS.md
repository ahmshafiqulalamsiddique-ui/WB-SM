# ⚡ Hostinger Quick Commands Reference

## 🎯 Your VPS Info
- **VPS**: srv1024097.hstgr.cloud
- **IP**: 72.60.101.107
- **Domain**: taleskillz.com
- **URL**: https://taleskillz.com

---

## 🚀 Essential Commands

### Access Your VPS
```bash
ssh root@72.60.101.107
```

### Navigate to Your Project
```bash
cd /var/www/taleskillz.com
```

### Check Application Status
```bash
pm2 status
pm2 logs taleskillz
pm2 monit
```

### Restart Application
```bash
pm2 restart taleskillz
```

### Check System Resources
```bash
htop
df -h
free -h
```

### Check Nginx Status
```bash
systemctl status nginx
nginx -t
systemctl restart nginx
```

---

## 🔧 Installation Commands (Run Once)

### Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs
```

### Install PM2
```bash
npm install -g pm2
```

### Install Nginx
```bash
apt install nginx -y
systemctl start nginx
systemctl enable nginx
```

### Install SSL Certificate
```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d taleskillz.com -d www.taleskillz.com
```

---

## 📁 Project Setup Commands

### Install Dependencies
```bash
cd /var/www/taleskillz.com
npm install --production
```

### Build Application
```bash
npm run build
```

### Start Application
```bash
pm2 start npm --name "taleskillz" -- start
pm2 startup
pm2 save
```

---

## 🌐 Domain Configuration

### Nginx Config File
```bash
nano /etc/nginx/sites-available/taleskillz.com
```

### Enable Site
```bash
ln -s /etc/nginx/sites-available/taleskillz.com /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

---

## 🗄️ MongoDB Atlas Setup

### Connection String Format
```
mongodb+srv://wb-admin:YourPassword123@wb-sm-cluster.xxxxx.mongodb.net/datacollect?retryWrites=true&w=majority
```

### Environment File
```bash
nano .env.local
```

---

## 🧪 Testing Commands

### Test Domain Resolution
```bash
nslookup taleskillz.com
```

### Test Port Access
```bash
netstat -tlnp | grep :3000
```

### Test Database Connection
```bash
npm run mongodb:init
```

---

## 🚨 Emergency Commands

### Stop Application
```bash
pm2 stop taleskillz
```

### View Error Logs
```bash
pm2 logs taleskillz --err
tail -f /var/log/nginx/error.log
```

### Restart Everything
```bash
pm2 restart taleskillz
systemctl restart nginx
```

---

## 📊 Monitoring Commands

### Real-time Monitoring
```bash
pm2 monit
htop
```

### Log Monitoring
```bash
pm2 logs taleskillz --lines 100
tail -f /var/log/nginx/access.log
```

### System Check
```bash
df -h
free -h
systemctl status nginx
pm2 status
```

---

## 🔄 Update Commands

### Update Application
```bash
cd /var/www/taleskillz.com
git pull origin main
npm install
npm run build
pm2 restart taleskillz
```

### Update System
```bash
apt update && apt upgrade -y
```

---

## 🎯 Quick Access URLs

- **Application**: https://taleskillz.com
- **Admin Login**: https://taleskillz.com/login
- **Register**: https://taleskillz.com/register
- **Admin Panel**: https://taleskillz.com/admin

### Admin Credentials
- **Email**: admin@datacollect.app
- **Password**: 33333333

---

## 📞 Support Resources

- **Hostinger Support**: Available 24/7 in your panel
- **MongoDB Atlas**: https://cloud.mongodb.com
- **PM2 Documentation**: https://pm2.keymetrics.io/docs/
- **Nginx Documentation**: https://nginx.org/en/docs/

---

## ✅ Success Checklist

- [ ] VPS is running
- [ ] Node.js installed
- [ ] PM2 installed
- [ ] Nginx installed
- [ ] Project uploaded
- [ ] Dependencies installed
- [ ] Environment configured
- [ ] Application built
- [ ] PM2 started
- [ ] Nginx configured
- [ ] SSL certificate installed
- [ ] Domain working
- [ ] Database connected
- [ ] Admin access working

Your application is ready! 🚀
