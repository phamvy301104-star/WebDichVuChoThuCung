import React from 'react';
import { RegisterForm } from '@components/Auth/RegisterForm';
import { Header } from '@components/Common/Header';
import { Footer } from '@components/Common/Footer';

export const RegisterPage: React.FC = () => {
  return (
    <>
      <Header />
      <main className="page-container auth-page">
        <div className="auth-form-container">
          <RegisterForm />
        </div>
      </main>
      <Footer />
    </>
  );
};
