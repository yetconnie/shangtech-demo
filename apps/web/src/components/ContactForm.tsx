'use client';

import { useState, FormEvent } from 'react';
import apiClient from '@/lib/api';

const PRODUCT_OPTIONS = [
  { value: '', label: '请选择您感兴趣的产品' },
  { value: '云原生平台', label: '云原生平台' },
  { value: 'AI 智能引擎', label: 'AI 智能引擎' },
  { value: '数据中枢', label: '数据中枢' },
  { value: '安全护盾', label: '安全护盾' },
  { value: '其他', label: '其他' },
];

interface FormData {
  name: string;
  company: string;
  position: string;
  email: string;
  phone: string;
  productInterest: string;
  message: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INITIAL_DATA: FormData = {
  name: '',
  company: '',
  position: '',
  email: '',
  phone: '',
  productInterest: '',
  message: '',
};

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  const updateField = (key: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (formErrors[key]) {
      setFormErrors((prev) => ({ ...prev, [key]: undefined }));
    }
    if (submitError) {
      setSubmitError('');
    }
  };

  const validate = (): boolean => {
    const errors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.name.trim()) errors.name = '请输入姓名';
    if (!formData.company.trim()) errors.company = '请输入公司名称';
    if (!formData.position.trim()) errors.position = '请输入职位';
    if (!formData.email.trim()) {
      errors.email = '请输入邮箱';
    } else if (!EMAIL_REGEX.test(formData.email)) {
      errors.email = '请输入有效的邮箱地址';
    }
    if (!formData.productInterest) errors.productInterest = '请选择感兴趣的产品';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError('');

    try {
      await apiClient.post('/api/inquiries', formData);
      setSubmitted(true);
      setFormData(INITIAL_DATA);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string | string[] } }; message?: string };
      const raw = error?.response?.data?.message;
      let msg: string;
      if (Array.isArray(raw)) {
        msg = raw.join('；');
      } else if (typeof raw === 'string') {
        msg = raw;
      } else {
        msg = '提交失败，请稍后重试，或直接发送邮件至 contact@shangtech.com';
      }
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="contact-form-success">
        <div className="success-icon" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12.5L10 17.5L19 7.5"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3>提交成功</h3>
        <p>感谢您的咨询，我们的专家团队将在 1-2 个工作日内与您联系。</p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="contact-form-grid">
        <div className="form-group">
          <label className="form-label" htmlFor="cf-name">
            姓名 <span className="form-required">*</span>
          </label>
          <input
            id="cf-name"
            type="text"
            className="form-input"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="您的称呼"
            disabled={submitting}
          />
          {formErrors.name && <span className="form-error">{formErrors.name}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="cf-company">
            公司 <span className="form-required">*</span>
          </label>
          <input
            id="cf-company"
            type="text"
            className="form-input"
            value={formData.company}
            onChange={(e) => updateField('company', e.target.value)}
            placeholder="所在公司名称"
            disabled={submitting}
          />
          {formErrors.company && <span className="form-error">{formErrors.company}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="cf-position">
            职位 <span className="form-required">*</span>
          </label>
          <input
            id="cf-position"
            type="text"
            className="form-input"
            value={formData.position}
            onChange={(e) => updateField('position', e.target.value)}
            placeholder="您的职位"
            disabled={submitting}
          />
          {formErrors.position && <span className="form-error">{formErrors.position}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="cf-email">
            邮箱 <span className="form-required">*</span>
          </label>
          <input
            id="cf-email"
            type="email"
            className="form-input"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="name@company.com"
            disabled={submitting}
          />
          {formErrors.email && <span className="form-error">{formErrors.email}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="cf-phone">
            电话
          </label>
          <input
            id="cf-phone"
            type="tel"
            className="form-input"
            value={formData.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            placeholder="选填"
            disabled={submitting}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="cf-product">
            感兴趣的产品 <span className="form-required">*</span>
          </label>
          <select
            id="cf-product"
            className="form-select"
            value={formData.productInterest}
            onChange={(e) => updateField('productInterest', e.target.value)}
            disabled={submitting}
          >
            {PRODUCT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.value === ''}>
                {opt.label}
              </option>
            ))}
          </select>
          {formErrors.productInterest && (
            <span className="form-error">{formErrors.productInterest}</span>
          )}
        </div>

        <div className="form-group full">
          <label className="form-label" htmlFor="cf-message">
            留言
          </label>
          <textarea
            id="cf-message"
            className="form-textarea"
            value={formData.message}
            onChange={(e) => updateField('message', e.target.value)}
            placeholder="请简要描述您的需求或希望了解的内容"
            rows={4}
            disabled={submitting}
          />
        </div>

        <div className="form-submit-area">
          <button
            type="submit"
            className="btn btn-primary btn-large"
            disabled={submitting}
          >
            {submitting ? '提交中…' : '提交咨询'}
            {!submitting && <span className="arrow">&rarr;</span>}
          </button>
          {submitError && <span className="form-error form-submit-error">{submitError}</span>}
        </div>
      </div>

      <p className="form-fallback">
        或直接发送邮件至{' '}
        <a href="mailto:contact@shangtech.com">contact@shangtech.com</a>
      </p>
    </form>
  );
}
