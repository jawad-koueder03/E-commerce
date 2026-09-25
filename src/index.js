// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/global.css';

// === إنشاء نقطة الدخول ===
const root = ReactDOM.createRoot(document.getElementById('root'));

// === تقديم التطبيق ===
root.render(
  <React.StrictMode>
    <BrowserRouter basename="/E-commerce">
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// === تسجيل Service Worker (اختياري) ===
// إذا كنت تستخدم خدمة العمل لتشغيل التطبيق بدون اتصال
// يمكنك تفعيلها عن طريق إلغاء التعليق على السطر التالي
// serviceWorkerRegistration.register();

// === إعدادات التحليلات (اختياري) ===
// إذا كنت تستخدم Google Analytics أو أي أداة تحليلات
// reportWebVitals(console.log);
