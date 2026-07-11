// ĐÃ SỬA: Loại bỏ hoàn toàn dòng import thừa từ 'http2' do IDE sinh tự động gây rối code

export const validateEmail = (email: string): boolean => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const validatePassword = (password: string): boolean => {
  // Mật khẩu bắt buộc chuỗi và tối thiểu 6 ký tự
  return typeof password === 'string' && password.length >= 6;
};

export const validatePhone = (phone: string): boolean => {
  if (!phone) return false;
  // Khớp số điện thoại Việt Nam 10 số, chấp nhận đầu số +84 hoặc 0
  const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
  return phoneRegex.test(phone.trim());
};