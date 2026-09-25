// src/pages/ProfilePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Button from '../components/common/Button';
import './ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateUser, changePassword, logout, getInitials, getFullName } = useAuth();
  const { totalItems } = useCart();

  // حالات الصفحة
  const [activeTab, setActiveTab] = useState('info'); // 'info' | 'password' | 'addresses' | 'settings'
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // نموذج المعلومات الشخصية
  const [infoForm, setInfoForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    birthDate: user?.birthDate || '',
  });

  // نموذج كلمة المرور
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [passwordErrors, setPasswordErrors] = useState({});

  // نموذج العناوين
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [newAddress, setNewAddress] = useState({
    label: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'SA',
    isDefault: false,
  });
  const [showAddressForm, setShowAddressForm] = useState(false);

  // نموذج الإعدادات
  const [settings, setSettings] = useState({
    newsletter: user?.settings?.newsletter ?? true,
    notifications: user?.settings?.notifications ?? true,
    smsAlerts: user?.settings?.smsAlerts ?? false,
    language: user?.settings?.language || 'ar',
    currency: user?.settings?.currency || 'USD',
  });

  // تبويبات الصفحة
  const tabs = [
    { id: 'info', label: 'المعلومات الشخصية', icon: '👤' },
    { id: 'password', label: 'كلمة المرور', icon: '🔒' },
    { id: 'addresses', label: 'العناوين', icon: '📍' },
    { id: 'settings', label: 'الإعدادات', icon: '⚙️' },
  ];

  // عرض رسالة نجاح مؤقتة
  const showSuccess = (message) => {
    setSuccessMessage(message);
    setErrorMessage('');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // عرض رسالة خطأ
  const showError = (message) => {
    setErrorMessage(message);
    setSuccessMessage('');
    setTimeout(() => setErrorMessage(''), 3000);
  };

  // معالجة تغيير المعلومات الشخصية
  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setInfoForm(prev => ({ ...prev, [name]: value }));
  };

  // حفظ المعلومات الشخصية
  const handleSaveInfo = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage('');

    try {
      const success = await updateUser(infoForm);
      if (success) {
        showSuccess('تم حفظ المعلومات بنجاح');
        setIsEditing(false);
      } else {
        showError('فشل حفظ المعلومات');
      }
    } catch (error) {
      showError(error.message || 'حدث خطأ');
    } finally {
      setIsSaving(false);
    }
  };

  // معالجة تغيير كلمة المرور
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // حفظ كلمة المرور
  const handleSavePassword = async (e) => {
    e.preventDefault();

    // التحقق من الصحة
    const errors = {};
    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'كلمة المرور الحالية مطلوبة';
    }
    if (!passwordForm.newPassword) {
      errors.newPassword = 'كلمة المرور الجديدة مطلوبة';
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'كلمتا المرور غير متطابقتين';
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setIsSaving(true);
    try {
      const success = await changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      if (success) {
        showSuccess('تم تغيير كلمة المرور بنجاح');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        showError('فشل تغيير كلمة المرور');
      }
    } catch (error) {
      showError(error.message || 'حدث خطأ');
    } finally {
      setIsSaving(false);
    }
  };

  // إضافة عنوان جديد
  const handleAddAddress = () => {
    if (!newAddress.label || !newAddress.address || !newAddress.city) {
      showError('الرجاء إكمال جميع الحقول المطلوبة');
      return;
    }

    const addressToAdd = {
      ...newAddress,
      id: Date.now(),
    };

    const updatedAddresses = newAddress.isDefault
      ? addresses.map(a => ({ ...a, isDefault: false })).concat(addressToAdd)
      : [...addresses, addressToAdd];

    setAddresses(updatedAddresses);
    setNewAddress({
      label: '',
      address: '',
      city: '',
      postalCode: '',
      country: 'SA',
      isDefault: false,
    });
    setShowAddressForm(false);
    showSuccess('تم إضافة العنوان بنجاح');
  };

  // حذف عنوان
  const handleDeleteAddress = (id) => {
    setAddresses(addresses.filter(a => a.id !== id));
    showSuccess('تم حذف العنوان');
  };

  // تعيين عنوان افتراضي
  const handleSetDefaultAddress = (id) => {
    setAddresses(addresses.map(a => ({ ...a, isDefault: a.id === id })));
    showSuccess('تم تعيين العنوان الافتراضي');
  };

  // حفظ الإعدادات
  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await updateUser({ settings });
      showSuccess('تم حفظ الإعدادات بنجاح');
    } catch (error) {
      showError(error.message || 'حدث خطأ');
    } finally {
      setIsSaving(false);
    }
  };

  // تسجيل الخروج
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="profile-page">
      {/* === رأس الصفحة === */}
      <div className="profile-header">
        <div className="profile-cover"></div>
        <div className="profile-header-content">
          <div className="profile-avatar">
            <span className="avatar-initials">{getInitials()}</span>
            <button className="avatar-edit" aria-label="تغيير الصورة">
              📷
            </button>
          </div>
          <div className="profile-header-info">
            <h1 className="profile-name">{getFullName()}</h1>
            <p className="profile-email">{user?.email}</p>
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-value">{totalItems || 0}</span>
                <span className="stat-label">منتج في السلة</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">0</span>
                <span className="stat-label">طلب</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">0</span>
                <span className="stat-label">في المفضلة</span>
              </div>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="logout-btn"
          >
            🚪 تسجيل الخروج
          </Button>
        </div>
      </div>

      {/* === رسائل الحالة === */}
      {successMessage && (
        <div className="alert alert-success">
          <span>✅</span> {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="alert alert-error">
          <span>❌</span> {errorMessage}
        </div>
      )}

      {/* === تبويبات الصفحة === */}
      <div className="profile-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* === محتوى التبويب === */}
      <div className="profile-content">
        {/* تبويب المعلومات الشخصية */}
        {activeTab === 'info' && (
          <div className="tab-panel">
            <div className="panel-header">
              <h2 className="panel-title">المعلومات الشخصية</h2>
              <Button
                variant={isEditing ? 'outline' : 'primary'}
                size="small"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'إلغاء' : '✏️ تعديل'}
              </Button>
            </div>

            <form className="profile-form" onSubmit={handleSaveInfo}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">الاسم الأول</label>
                  <input
                    type="text"
                    name="firstName"
                    value={infoForm.firstName}
                    onChange={handleInfoChange}
                    className="form-input"
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">الاسم الأخير</label>
                  <input
                    type="text"
                    name="lastName"
                    value={infoForm.lastName}
                    onChange={handleInfoChange}
                    className="form-input"
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">البريد الإلكتروني</label>
                  <input
                    type="email"
                    name="email"
                    value={infoForm.email}
                    onChange={handleInfoChange}
                    className="form-input"
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">رقم الهاتف</label>
                  <input
                    type="tel"
                    name="phone"
                    value={infoForm.phone}
                    onChange={handleInfoChange}
                    className="form-input"
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">تاريخ الميلاد</label>
                  <input
                    type="date"
                    name="birthDate"
                    value={infoForm.birthDate}
                    onChange={handleInfoChange}
                    className="form-input"
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group full-width">
                  <label className="form-label">نبذة عنك</label>
                  <textarea
                    name="bio"
                    value={infoForm.bio}
                    onChange={handleInfoChange}
                    className="form-textarea"
                    rows="3"
                    placeholder="اكتب نبذة مختصرة عنك..."
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {isEditing && (
                <div className="form-actions">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSaving}
                  >
                    {isSaving ? 'جاري الحفظ...' : '💾 حفظ التغييرات'}
                  </Button>
                </div>
              )}
            </form>
          </div>
        )}

        {/* تبويب كلمة المرور */}
        {activeTab === 'password' && (
          <div className="tab-panel">
            <div className="panel-header">
              <h2 className="panel-title">تغيير كلمة المرور</h2>
            </div>

            <form className="profile-form" onSubmit={handleSavePassword}>
              <div className="form-group">
                <label className="form-label">كلمة المرور الحالية *</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  className={`form-input ${passwordErrors.currentPassword ? 'error' : ''}`}
                  placeholder="••••••••"
                />
                {passwordErrors.currentPassword && (
                  <span className="error-text">{passwordErrors.currentPassword}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">كلمة المرور الجديدة *</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className={`form-input ${passwordErrors.newPassword ? 'error' : ''}`}
                  placeholder="••••••••"
                />
                {passwordErrors.newPassword && (
                  <span className="error-text">{passwordErrors.newPassword}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">تأكيد كلمة المرور *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className={`form-input ${passwordErrors.confirmPassword ? 'error' : ''}`}
                  placeholder="••••••••"
                />
                {passwordErrors.confirmPassword && (
                  <span className="error-text">{passwordErrors.confirmPassword}</span>
                )}
              </div>

              <div className="form-actions">
                <Button type="submit" variant="primary" disabled={isSaving}>
                  {isSaving ? 'جاري التحديث...' : '🔒 تحديث كلمة المرور'}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* تبويب العناوين */}
        {activeTab === 'addresses' && (
          <div className="tab-panel">
            <div className="panel-header">
              <h2 className="panel-title">عناوين الشحن</h2>
              <Button
                variant="primary"
                size="small"
                onClick={() => setShowAddressForm(!showAddressForm)}
              >
                {showAddressForm ? 'إلغاء' : '+ إضافة عنوان'}
              </Button>
            </div>

            {/* نموذج إضافة عنوان */}
            {showAddressForm && (
              <div className="address-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">تسمية العنوان</label>
                    <input
                      type="text"
                      value={newAddress.label}
                      onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                      className="form-input"
                      placeholder="مثال: المنزل، العمل"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">المدينة</label>
                    <input
                      type="text"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      className="form-input"
                      placeholder="الرياض"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label className="form-label">العنوان الكامل</label>
                    <input
                      type="text"
                      value={newAddress.address}
                      onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                      className="form-input"
                      placeholder="الشارع، الحي، رقم المبنى"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">الرمز البريدي</label>
                    <input
                      type="text"
                      value={newAddress.postalCode}
                      onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                      className="form-input"
                      placeholder="12345"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">الدولة</label>
                    <select
                      value={newAddress.country}
                      onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                      className="form-select"
                    >
                      <option value="SA">🇸🇦 السعودية</option>
                      <option value="AE">🇦🇪 الإمارات</option>
                      <option value="KW">🇰🇼 الكويت</option>
                      <option value="QA">🇶🇦 قطر</option>
                      <option value="EG">🇪🇬 مصر</option>
                    </select>
                  </div>
                  <div className="form-group full-width">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={newAddress.isDefault}
                        onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                      />
                      <span>تعيين كعنوان افتراضي</span>
                    </label>
                  </div>
                </div>
                <div className="form-actions">
                  <Button variant="primary" onClick={handleAddAddress}>
                    💾 حفظ العنوان
                  </Button>
                </div>
              </div>
            )}

            {/* قائمة العناوين */}
            <div className="addresses-list">
              {addresses.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">📍</span>
                  <p>لا توجد عناوين محفوظة</p>
                </div>
              ) : (
                addresses.map(address => (
                  <div key={address.id} className={`address-card ${address.isDefault ? 'default' : ''}`}>
                    <div className="address-header">
                      <h4 className="address-label">
                        {address.label}
                        {address.isDefault && <span className="default-badge">افتراضي</span>}
                      </h4>
                    </div>
                    <p className="address-text">{address.address}</p>
                    <p className="address-details">
                      {address.city}, {address.postalCode} - {address.country}
                    </p>
                    <div className="address-actions">
                      {!address.isDefault && (
                        <button 
                          className="address-btn"
                          onClick={() => handleSetDefaultAddress(address.id)}
                        >
                          ⭐ تعيين كافتراضي
                        </button>
                      )}
                      <button 
                        className="address-btn delete"
                        onClick={() => handleDeleteAddress(address.id)}
                      >
                        🗑️ حذف
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* تبويب الإعدادات */}
        {activeTab === 'settings' && (
          <div className="tab-panel">
            <div className="panel-header">
              <h2 className="panel-title">إعدادات الحساب</h2>
            </div>

            <div className="settings-section">
              <h3 className="settings-subtitle">🔔 الإشعارات</h3>
              <div className="setting-item">
                <div className="setting-info">
                  <span className="setting-label">النشرة البريدية</span>
                  <span className="setting-description">تلقي عروض حصرية وأخبار المتجر</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.newsletter}
                    onChange={(e) => setSettings({ ...settings, newsletter: e.target.checked })}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <span className="setting-label">الإشعارات الفورية</span>
                  <span className="setting-description">إشعارات حول الطلبات والعروض</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <span className="setting-label">رسائل SMS</span>
                  <span className="setting-description">تلقي تنبيهات عبر الرسائل النصية</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.smsAlerts}
                    onChange={(e) => setSettings({ ...settings, smsAlerts: e.target.checked })}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="settings-section">
              <h3 className="settings-subtitle">🌐 التفضيلات</h3>
              <div className="setting-item">
                <div className="setting-info">
                  <span className="setting-label">اللغة</span>
                </div>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                  className="form-select"
                >
                  <option value="ar">🇸🇦 العربية</option>
                  <option value="en">🇬🇧 English</option>
                  <option value="fr">🇫🇷 Français</option>
                </select>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <span className="setting-label">العملة</span>
                </div>
                <select
                  value={settings.currency}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  className="form-select"
                >
                  <option value="USD">$ USD</option>
                  <option value="SAR">﷼ SAR</option>
                  <option value="AED">د.إ AED</option>
                  <option value="EGP">£ EGP</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <Button
                variant="primary"
                onClick={handleSaveSettings}
                disabled={isSaving}
              >
                {isSaving ? 'جاري الحفظ...' : '💾 حفظ الإعدادات'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;