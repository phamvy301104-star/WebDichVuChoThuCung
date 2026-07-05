import React from 'react';
import { LoginForm } from '@components/Auth/LoginForm';
import { Header } from '@components/Common/Header';
import { Footer } from '@components/Common/Footer';

export const LoginPage: React.FC = () => {
  return (
    <>
      <Header />
      <main className="page-container auth-page">
        <div className="auth-form-container">
          <LoginForm />
        </div>
      </main>
      <Footer />
    </>
  );
};
