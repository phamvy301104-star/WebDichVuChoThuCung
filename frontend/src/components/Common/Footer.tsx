import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>PetCare</h3>
            <p>Nền tảng chăm sóc thú cưng toàn diện</p>
          </div>

          <div className="footer-section">
            <h4>Liên kết nhanh</h4>
            <ul>
              <li><a href="#products">Sản phẩm</a></li>
              <li><a href="#services">Dịch vụ</a></li>
              <li><a href="#about">Về chúng tôi</a></li>
              <li><a href="#contact">Liên hệ</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Hỗ trợ</h4>
            <ul>
              <li><a href="#help">Trợ giúp</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#privacy">Chính sách</a></li>
              <li><a href="#terms">Điều khoản</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 PetCare. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};
