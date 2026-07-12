import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@stores/store';
import { Header } from '@components/Common/Header';
import { Footer } from '@components/Common/Footer';

const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ';

// ─── Comprehensive Animal Database ───────────────────────────────────────────
const ANIMAL_DB: Record<string, {
  nameVi: string; species: string; origin: string; size: string;
  weight: string; lifespan: string; temperament: string[];
  care: string; food: string; icon: string; color: string; isPet: boolean;
}> = {
  // === DOGS ===
  'golden retriever':     { nameVi: 'Chó Golden Retriever', species: 'Chó', origin: 'Scotland, Anh', size: 'Lớn', weight: '25-34 kg', lifespan: '10-12 năm', temperament: ['Thân thiện','Đáng tin','Thông minh','Tình cảm'], care: 'Vận động nhiều, tắm 2 tuần/lần, chải lông hàng tuần', food: 'Thức ăn khô cao cấp, 2-3 bữa/ngày', icon: '🐕', color: '#f9e8d0', isPet: true },
  'labrador retriever':   { nameVi: 'Chó Labrador', species: 'Chó', origin: 'Newfoundland, Canada', size: 'Lớn', weight: '25-36 kg', lifespan: '10-12 năm', temperament: ['Thân thiện','Vâng lời','Tình cảm','Hoạt bát'], care: 'Vận động hàng ngày, chải lông hàng tuần', food: 'Thức ăn giàu protein, 2 bữa/ngày', icon: '🐕', color: '#e8dcc8', isPet: true },
  'poodle':               { nameVi: 'Chó Poodle', species: 'Chó', origin: 'Đức/Pháp', size: 'Vừa/Nhỏ', weight: '3-32 kg', lifespan: '12-15 năm', temperament: ['Thông minh','Không rụng lông','Tình cảm','Hoạt bát'], care: 'Cắt lông 6-8 tuần/lần', food: 'Thức ăn chất lượng cao, kiểm soát cân nặng', icon: '🐩', color: '#f0e8f8', isPet: true },
  'corgi':                { nameVi: 'Chó Corgi', species: 'Chó', origin: 'Wales, Anh', size: 'Nhỏ/Vừa', weight: '10-14 kg', lifespan: '12-15 năm', temperament: ['Năng động','Thông minh','Vui vẻ','Vâng lời'], care: 'Chải lông 2-3 lần/tuần', food: 'Kiểm soát khẩu phần tránh béo', icon: '🐕', color: '#fde8d0', isPet: true },
  'husky':                { nameVi: 'Chó Husky Siberia', species: 'Chó', origin: 'Siberia, Nga', size: 'Vừa/Lớn', weight: '16-27 kg', lifespan: '12-15 năm', temperament: ['Năng động','Thân thiện','Độc lập','Vui nghịch'], care: 'Vận động nhiều, chải lông mùa thay lông', food: 'Protein cao, 2 bữa/ngày', icon: '🐕', color: '#e8f0f8', isPet: true },
  'german shepherd':      { nameVi: 'Chó German Shepherd', species: 'Chó', origin: 'Đức', size: 'Lớn', weight: '22-40 kg', lifespan: '9-13 năm', temperament: ['Trung thành','Thông minh','Dũng cảm','Bảo vệ'], care: 'Vận động mạnh, huấn luyện từ nhỏ', food: 'Thức ăn giàu dinh dưỡng cao', icon: '🐕', color: '#e8e8d8', isPet: true },
  'chihuahua':            { nameVi: 'Chó Chihuahua', species: 'Chó', origin: 'Mexico', size: 'Rất nhỏ', weight: '1.5-3 kg', lifespan: '14-17 năm', temperament: ['Dũng cảm','Tự tin','Tình cảm','Nhạy cảm'], care: 'Giữ ấm, chải lông hàng tuần', food: 'Thức ăn cho chó nhỏ, chia nhỏ bữa', icon: '🐕', color: '#f8e8e8', isPet: true },
  'shih tzu':             { nameVi: 'Chó Shih Tzu', species: 'Chó', origin: 'Tây Tạng/Trung Quốc', size: 'Nhỏ', weight: '4-7 kg', lifespan: '10-16 năm', temperament: ['Tình cảm','Vui vẻ','Thân thiện','Quấn chủ'], care: 'Chải lông hàng ngày, vệ sinh mắt thường xuyên', food: 'Thức ăn cho chó nhỏ, protein vừa', icon: '🐕', color: '#f8f0e0', isPet: true },
  'beagle':               { nameVi: 'Chó Beagle', species: 'Chó', origin: 'Anh', size: 'Vừa', weight: '9-11 kg', lifespan: '12-15 năm', temperament: ['Tò mò','Vui vẻ','Thân thiện','Năng động'], care: 'Vận động hàng ngày, kiểm soát ăn uống', food: 'Thức ăn chất lượng, kiểm soát cân nặng', icon: '🐕', color: '#e8f0e8', isPet: true },
  'bulldog':              { nameVi: 'Chó Bulldog', species: 'Chó', origin: 'Anh', size: 'Vừa', weight: '18-25 kg', lifespan: '8-10 năm', temperament: ['Điềm tĩnh','Tình cảm','Dũng cảm','Ngoan'], care: 'Vệ sinh nếp da, tránh nắng nóng', food: 'Thức ăn chất lượng cao, 2 bữa/ngày', icon: '🐕', color: '#e8e0d8', isPet: true },
  'maltese':              { nameVi: 'Chó Maltese', species: 'Chó', origin: 'Malta, Địa Trung Hải', size: 'Rất nhỏ', weight: '1.4-3.2 kg', lifespan: '12-15 năm', temperament: ['Tình cảm','Vui vẻ','Thân thiện','Dũng cảm'], care: 'Chải lông hàng ngày, cắt lông thường xuyên', food: 'Thức ăn cao cấp cho chó nhỏ', icon: '🐕', color: '#f8f8f0', isPet: true },
  'dachshund':            { nameVi: 'Chó Lạp Xưởng Dachshund', species: 'Chó', origin: 'Đức', size: 'Nhỏ', weight: '3.6-15 kg', lifespan: '12-16 năm', temperament: ['Dũng cảm','Năng động','Lanh lợi','Cứng đầu'], care: 'Tránh béo phì, bảo vệ cột sống', food: 'Kiểm soát khẩu phần nghiêm ngặt', icon: '🐕', color: '#e8d8c8', isPet: true },
  // === CATS ===
  'cat':                  { nameVi: 'Mèo nhà', species: 'Mèo', origin: 'Đa dạng', size: 'Vừa', weight: '3-5 kg', lifespan: '12-18 năm', temperament: ['Độc lập','Tình cảm','Thích vui chơi','Thông minh'], care: 'Chải lông hàng tuần, vệ sinh khay cát', food: 'Thức ăn cân bằng protein cao', icon: '🐱', color: '#f0f8e8', isPet: true },
  'persian cat':          { nameVi: 'Mèo Ba Tư', species: 'Mèo', origin: 'Iran', size: 'Vừa/Lớn', weight: '3.5-7 kg', lifespan: '12-17 năm', temperament: ['Điềm tĩnh','Sang chảnh','Tình cảm','Thụ động'], care: 'Chải lông hàng ngày, vệ sinh mắt thường xuyên', food: 'Thức ăn cao cấp, protein vừa', icon: '🐱', color: '#f8f0e8', isPet: true },
  'siamese cat':          { nameVi: 'Mèo Xiêm', species: 'Mèo', origin: 'Thái Lan', size: 'Vừa', weight: '3-5 kg', lifespan: '15-20 năm', temperament: ['Hoạt bát','Thông minh','Tình cảm','Hay kêu'], care: 'Tương tác nhiều, chải lông hàng tuần', food: 'Thức ăn protein cao, chia 2-3 bữa', icon: '🐱', color: '#e8f0f8', isPet: true },
  'maine coon':           { nameVi: 'Mèo Maine Coon', species: 'Mèo', origin: 'Maine, Mỹ', size: 'Lớn', weight: '5-9 kg', lifespan: '12-15 năm', temperament: ['Tình cảm','Vui vẻ','Thông minh','Thân thiện'], care: 'Chải lông 2-3 lần/tuần', food: 'Thức ăn giàu protein, thức ăn ướt', icon: '🐱', color: '#e8f8e8', isPet: true },
  'british shorthair':    { nameVi: 'Mèo Anh Lông Ngắn', species: 'Mèo', origin: 'Anh', size: 'Vừa/Lớn', weight: '4-8 kg', lifespan: '14-20 năm', temperament: ['Điềm tĩnh','Độc lập','Tình cảm','Ít sủa'], care: 'Chải lông hàng tuần', food: 'Thức ăn cân bằng, kiểm soát calo', icon: '🐱', color: '#f8f0e8', isPet: true },
  'ragdoll':              { nameVi: 'Mèo Ragdoll', species: 'Mèo', origin: 'California, Mỹ', size: 'Lớn', weight: '5-9 kg', lifespan: '15-20 năm', temperament: ['Hiền lành','Thích được ẵm','Tình cảm','Thụ động'], care: 'Chải lông 2-3 lần/tuần', food: 'Thức ăn chất lượng cao, protein vừa', icon: '🐱', color: '#f0f8f8', isPet: true },
  // === OTHER PETS ===
  'rabbit':               { nameVi: 'Thỏ cảnh', species: 'Thỏ', origin: 'Đa dạng', size: 'Nhỏ', weight: '1.5-2.5 kg', lifespan: '7-14 năm', temperament: ['Đáng yêu','Tình cảm','Hiền','Thích khám phá'], care: 'Vệ sinh chuồng thường xuyên, không tắm nước', food: 'Cỏ khô, rau xanh, pellet', icon: '🐇', color: '#f0e8f8', isPet: true },
  'hamster':              { nameVi: 'Chuột Hamster', species: 'Hamster', origin: 'Trung Đông/Châu Âu', size: 'Rất nhỏ', weight: '20-180 g', lifespan: '2-3 năm', temperament: ['Năng động về đêm','Nhút nhát','Độc lập','Đáng yêu'], care: 'Chuồng lớn + bánh xe, thay lót tuần/lần', food: 'Hạt hamster, rau củ tươi', icon: '🐹', color: '#f8e8e0', isPet: true },
  'parrot':               { nameVi: 'Vẹt cảnh', species: 'Chim Vẹt', origin: 'Nam Mỹ/Châu Phi/Châu Á', size: 'Nhỏ/Vừa', weight: '30g-1.5 kg', lifespan: '20-80 năm', temperament: ['Thông minh','Tình cảm','Hay nói','Vui vẻ'], care: 'Lồng rộng, tắm nước thường xuyên, tương tác hàng ngày', food: 'Hạt, trái cây tươi, rau xanh', icon: '🦜', color: '#e8f8e0', isPet: true },
  'bird':                 { nameVi: 'Chim cảnh', species: 'Chim', origin: 'Đa dạng', size: 'Nhỏ', weight: '20-500 g', lifespan: '5-80 năm', temperament: ['Vui vẻ','Hoạt bát','Thông minh','Tự do'], care: 'Lồng sạch, ánh sáng tự nhiên, nước uống sạch', food: 'Hạt chim, rau quả tươi, khoáng chất', icon: '🐦', color: '#e0f0f8', isPet: true },
  'turtle':               { nameVi: 'Rùa cảnh', species: 'Rùa', origin: 'Đa dạng', size: 'Nhỏ/Vừa', weight: '0.1-10 kg', lifespan: '20-150 năm', temperament: ['Bình tĩnh','Không ồn','Độc lập','Thích bơi lội'], care: 'Bể nước sạch + khu phơi nắng, UVB lamp', food: 'Rau xanh, cá nhỏ, thức ăn chuyên dụng', icon: '🐢', color: '#e0f0e0', isPet: true },
  'fish':                 { nameVi: 'Cá cảnh', species: 'Cá', origin: 'Đa dạng', size: 'Rất nhỏ', weight: '1g-5 kg', lifespan: '1-20 năm', temperament: ['Bình tĩnh','Đẹp mắt','Không ồn'], care: 'Bể sạch, thay nước 20-30%/tuần, lọc nước', food: 'Thức ăn viên chuyên dụng, ăn 2 lần/ngày', icon: '🐠', color: '#e0e8f8', isPet: true },
  // === WILD ANIMALS ===
  'lion':     { nameVi: 'Sư tử', species: 'Động vật hoang dã', origin: 'Châu Phi/Ấn Độ', size: 'Rất lớn', weight: '120-250 kg', lifespan: '10-14 năm', temperament: ['Dũng mãnh','Lãnh đạo','Xã hội'], care: 'Động vật hoang dã — không nuôi làm thú cưng', food: 'Thịt động vật, 7 kg/ngày', icon: '🦁', color: '#f8e8c0', isPet: false },
  'tiger':    { nameVi: 'Hổ', species: 'Động vật hoang dã', origin: 'Châu Á', size: 'Rất lớn', weight: '100-300 kg', lifespan: '10-15 năm', temperament: ['Đơn độc','Săn mồi','Lãnh thổ'], care: 'Động vật hoang dã — cần bảo tồn', food: 'Thịt tươi, 6-7 kg/ngày', icon: '🐯', color: '#f8d0a0', isPet: false },
  'elephant': { nameVi: 'Voi', species: 'Động vật hoang dã', origin: 'Châu Phi/Châu Á', size: 'Khổng lồ', weight: '2700-6000 kg', lifespan: '60-70 năm', temperament: ['Thông minh','Xã hội','Trung thành','Trí nhớ tốt'], care: 'Động vật hoang dã cần bảo tồn nghiêm ngặt', food: 'Cỏ, lá cây, quả, 150-200 kg/ngày', icon: '🐘', color: '#d8e0e8', isPet: false },
  'bear':     { nameVi: 'Gấu', species: 'Động vật hoang dã', origin: 'Bắc Mỹ/Châu Á/Châu Âu', size: 'Lớn/Rất lớn', weight: '100-700 kg', lifespan: '20-30 năm', temperament: ['Mạnh mẽ','Cô đơn','Ngủ đông'], care: 'Động vật hoang dã nguy hiểm', food: 'Toàn năng: cá, quả, mật ong, thịt', icon: '🐻', color: '#d8c8b0', isPet: false },
  'wolf':     { nameVi: 'Sói', species: 'Động vật hoang dã', origin: 'Bắc Mỹ/Châu Á/Châu Âu', size: 'Vừa/Lớn', weight: '20-80 kg', lifespan: '6-13 năm', temperament: ['Xã hội đàn','Thông minh','Trung thành với đàn'], care: 'Động vật hoang dã — tổ tiên của chó nhà', food: 'Thịt, 5-7 kg/ngày', icon: '🐺', color: '#d0d8e0', isPet: false },
  'fox':      { nameVi: 'Cáo', species: 'Động vật hoang dã', origin: 'Toàn cầu', size: 'Nhỏ/Vừa', weight: '2-14 kg', lifespan: '2-5 năm', temperament: ['Lanh lợi','Tò mò','Độc lập','Linh hoạt'], care: 'Một số giống có thể nuôi (Fennec fox)', food: 'Thịt nhỏ, trứng, quả', icon: '🦊', color: '#f0d0a0', isPet: false },
  'horse':    { nameVi: 'Ngựa', species: 'Ngựa', origin: 'Toàn cầu', size: 'Lớn', weight: '380-1000 kg', lifespan: '25-30 năm', temperament: ['Xã hội','Thông minh','Kỷ luật','Trung thành'], care: 'Chuồng rộng, vận động hàng ngày, chải lông', food: 'Cỏ khô, ngũ cốc, 10-15 kg/ngày', icon: '🐴', color: '#e8d8c0', isPet: false },
  'cow':      { nameVi: 'Bò', species: 'Gia súc', origin: 'Toàn cầu', size: 'Lớn', weight: '400-800 kg', lifespan: '15-20 năm', temperament: ['Bình tĩnh','Xã hội','Hiền lành'], care: 'Đồng cỏ rộng, nước sạch', food: 'Cỏ, ngũ cốc, 70 kg cỏ/ngày', icon: '🐄', color: '#e8e8d8', isPet: false },
  'pig':      { nameVi: 'Lợn/Heo', species: 'Gia súc', origin: 'Toàn cầu', size: 'Vừa/Lớn', weight: '50-300 kg', lifespan: '8-15 năm', temperament: ['Thông minh','Tò mò','Xã hội'], care: 'Mini pig có thể nuôi như thú cưng', food: 'Toàn năng, thức ăn chuyên dụng', icon: '🐷', color: '#f8d8d0', isPet: false },
  'snake':    { nameVi: 'Rắn cảnh', species: 'Bò sát', origin: 'Đa dạng', size: 'Đa dạng', weight: '0.1-10 kg', lifespan: '10-30 năm', temperament: ['Độc lập','Điềm tĩnh','Ít tương tác'], care: 'Hộp kính, nhiệt độ phù hợp, ánh sáng UV', food: 'Chuột sống/đông lạnh, 1 lần/tuần', icon: '🐍', color: '#d8e8d0', isPet: false },
  'monkey':   { nameVi: 'Khỉ', species: 'Linh trưởng', origin: 'Châu Á/Châu Phi', size: 'Vừa', weight: '3-30 kg', lifespan: '20-40 năm', temperament: ['Thông minh','Xã hội','Tò mò','Nghịch ngợm'], care: 'Động vật hoang dã — cần giấy phép đặc biệt', food: 'Trái cây, rau, côn trùng', icon: '🐒', color: '#e8d8c8', isPet: false },
};

// HF models to try in order (from most accurate to fallback)
const HF_MODELS = [
  'google/vit-base-patch16-224',
  'microsoft/resnet-50', 
  'Falconsai/animal_recognition',
];

const HF_TOKEN = import.meta.env.VITE_HF_API_KEY || '';

// Match HF prediction to our database
const matchAnimal = (predictions: { label: string; score: number }[]) => {
  const sorted = [...predictions].sort((a, b) => b.score - a.score);
  for (const pred of sorted) {
    const label = pred.label.toLowerCase().replace(/_/g, ' ').replace(/,.*/, '').trim();
    // Direct match
    for (const [key, val] of Object.entries(ANIMAL_DB)) {
      if (label.includes(key) || key.split(' ').every(w => label.includes(w))) {
        return { ...val, name: val.nameVi, confidence: Math.round(pred.score * 100), rawLabel: pred.label };
      }
    }
    // Partial match
    for (const [key, val] of Object.entries(ANIMAL_DB)) {
      const keyWords = key.split(' ');
      if (keyWords.some(w => w.length > 3 && label.includes(w))) {
        return { ...val, name: val.nameVi, confidence: Math.round(pred.score * 100), rawLabel: pred.label };
      }
    }
    // Generic species
    if (/\bdog\b|canine|hound|terrier|spaniel|setter|retriever|pointer|dachshund|pinscher/.test(label)) {
      return { ...ANIMAL_DB['golden retriever'], name: `Chó (${label})`, confidence: Math.round(pred.score * 100), rawLabel: pred.label };
    }
    if (/\bcat\b|feline|kitten|tabby|tortoiseshell|calico/.test(label)) {
      return { ...ANIMAL_DB['cat'], name: `Mèo (${label})`, confidence: Math.round(pred.score * 100), rawLabel: pred.label };
    }
    if (/rabbit|bunny|hare/.test(label)) {
      return { ...ANIMAL_DB['rabbit'], name: 'Thỏ', confidence: Math.round(pred.score * 100), rawLabel: pred.label };
    }
    if (/hamster|gerbil/.test(label)) {
      return { ...ANIMAL_DB['hamster'], name: 'Hamster', confidence: Math.round(pred.score * 100), rawLabel: pred.label };
    }
    if (/parrot|cockatiel|macaw|budgie|parakeet/.test(label)) {
      return { ...ANIMAL_DB['parrot'], name: 'Vẹt cảnh', confidence: Math.round(pred.score * 100), rawLabel: pred.label };
    }
    if (/bird|sparrow|robin|finch|canary|pigeon|dove/.test(label)) {
      return { ...ANIMAL_DB['bird'], name: `Chim (${label})`, confidence: Math.round(pred.score * 100), rawLabel: pred.label };
    }
    if (/lion/.test(label)) return { ...ANIMAL_DB['lion'], name: 'Sư tử', confidence: Math.round(pred.score * 100), rawLabel: pred.label };
    if (/tiger/.test(label)) return { ...ANIMAL_DB['tiger'], name: 'Hổ', confidence: Math.round(pred.score * 100), rawLabel: pred.label };
    if (/elephant/.test(label)) return { ...ANIMAL_DB['elephant'], name: 'Voi', confidence: Math.round(pred.score * 100), rawLabel: pred.label };
    if (/bear/.test(label)) return { ...ANIMAL_DB['bear'], name: 'Gấu', confidence: Math.round(pred.score * 100), rawLabel: pred.label };
    if (/wolf/.test(label)) return { ...ANIMAL_DB['wolf'], name: 'Sói', confidence: Math.round(pred.score * 100), rawLabel: pred.label };
    if (/fox/.test(label)) return { ...ANIMAL_DB['fox'], name: 'Cáo', confidence: Math.round(pred.score * 100), rawLabel: pred.label };
    if (/horse|pony|stallion/.test(label)) return { ...ANIMAL_DB['horse'], name: 'Ngựa', confidence: Math.round(pred.score * 100), rawLabel: pred.label };
    if (/cow|cattle|bull|bovine/.test(label)) return { ...ANIMAL_DB['cow'], name: 'Bò', confidence: Math.round(pred.score * 100), rawLabel: pred.label };
    if (/pig|swine|hog|boar/.test(label)) return { ...ANIMAL_DB['pig'], name: 'Lợn', confidence: Math.round(pred.score * 100), rawLabel: pred.label };
    if (/snake|python|boa|cobra/.test(label)) return { ...ANIMAL_DB['snake'], name: 'Rắn', confidence: Math.round(pred.score * 100), rawLabel: pred.label };
    if (/turtle|tortoise/.test(label)) return { ...ANIMAL_DB['turtle'], name: 'Rùa', confidence: Math.round(pred.score * 100), rawLabel: pred.label };
    if (/monkey|primate|ape|gorilla|chimp/.test(label)) return { ...ANIMAL_DB['monkey'], name: 'Khỉ/Linh trưởng', confidence: Math.round(pred.score * 100), rawLabel: pred.label };
    if (/fish|salmon|tuna|goldfish/.test(label)) return { ...ANIMAL_DB['fish'], name: `Cá (${label})`, confidence: Math.round(pred.score * 100), rawLabel: pred.label };
  }
  return null;
};

// Call Hugging Face Inference API
const callHfApi = async (imageBase64: string, modelId: string): Promise<{ label: string; score: number }[]> => {
  const base64Data = imageBase64.split(',')[1];
  const binaryStr = atob(base64Data);
  const bytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);
  const blob = new Blob([bytes], { type: 'image/jpeg' });

  const headers: Record<string, string> = { 'Content-Type': 'application/octet-stream' };
  if (HF_TOKEN) headers['Authorization'] = `Bearer ${HF_TOKEN}`;

  const res = await fetch(`https://api-inference.huggingface.co/models/${modelId}`, {
    method: 'POST', headers, body: blob,
  });
  if (!res.ok) throw new Error(`HF API error: ${res.status}`);
  return await res.json();
};

export const PetRecognizePage: React.FC = () => {
  const { products } = useSelector((s: RootState) => s.shop);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any | null>(null);
  const [dragging, setDragging] = useState(false);
  const [rawLabels, setRawLabels] = useState<{ label: string; score: number }[]>([]);
  const [notAnimal, setNotAnimal] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [modelUsed, setModelUsed] = useState('');

  const runAnalysis = async (dataUrl: string) => {
    setImageUrl(dataUrl);
    setAnalyzing(true);
    setResult(null);
    setNotAnimal(false);
    setRawLabels([]);
    setProgress(10);
    setStatusMsg('Đang gửi ảnh đến AI...');

    let predictions: { label: string; score: number }[] | null = null;
    let usedModel = '';

    // Try HF models in order
    for (const model of HF_MODELS) {
      try {
        setStatusMsg(`Đang phân tích với ${model.split('/')[1]}...`);
        setProgress(30 + HF_MODELS.indexOf(model) * 20);
        predictions = await callHfApi(dataUrl, model);
        usedModel = model;
        setProgress(85);
        break;
      } catch (err: any) {
        console.warn(`Model ${model} failed:`, err.message);
        // If model loading (503), wait and retry
        if (err.message.includes('503')) {
          setStatusMsg(`Mô hình ${model.split('/')[1]} đang khởi động, thử lại...`);
          await new Promise(r => setTimeout(r, 3000));
          try {
            predictions = await callHfApi(dataUrl, model);
            usedModel = model;
            setProgress(85);
            break;
          } catch {}
        }
      }
    }

    // Fallback to TensorFlow.js
    if (!predictions) {
      try {
        setStatusMsg('Dùng TensorFlow.js local...');
        const tf = await import('@tensorflow/tfjs');
        const mobilenet = await import('@tensorflow-models/mobilenet');
        await tf.ready();
        const model = await mobilenet.load({ version: 2, alpha: 1.0 });
        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject; img.src = dataUrl; });
        const preds = await model.classify(img, 10);
        predictions = preds.map(p => ({ label: p.className, score: p.probability }));
        usedModel = 'tensorflow/mobilenet-v2';
      } catch (err) {
        console.error('TF fallback failed:', err);
      }
    }

    setProgress(95);
    setModelUsed(usedModel);

    if (predictions && predictions.length > 0) {
      const top5 = predictions.slice(0, 5);
      setRawLabels(top5);
      const match = matchAnimal(predictions);
      setTimeout(() => {
        if (match) setResult(match);
        else setNotAnimal(true);
        setAnalyzing(false);
        setProgress(100);
        setStatusMsg('');
      }, 300);
    } else {
      setNotAnimal(true);
      setAnalyzing(false);
      setProgress(100);
      setStatusMsg('');
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return alert('Vui lòng chọn file ảnh.');
    if (file.size > 10 * 1024 * 1024) return alert('File quá lớn (tối đa 10MB).');
    const reader = new FileReader();
    reader.onload = e => runAnalysis(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const reset = () => { setImageUrl(null); setResult(null); setNotAnimal(false); setRawLabels([]); setProgress(0); setAnalyzing(false); setStatusMsg(''); if (fileInputRef.current) fileInputRef.current.value = ''; };

  const relatedProducts = products.filter(p => p.status === 'active').slice(0, 4);

  return (
    <>
      <Header />
      <main className="page-container" style={{ maxWidth: 960, margin: '0 auto', padding: '32px 20px' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: '3.5rem', marginBottom: 12 }}>🤖</div>
          <h1 style={{ fontWeight: 900, color: '#111', fontSize: '2.2rem', margin: '0 0 10px', letterSpacing: '-0.03em' }}>
            AI Nhận diện động vật
          </h1>
          <p style={{ color: '#888', maxWidth: 560, margin: '0 auto', lineHeight: 1.7, fontSize: '0.95rem' }}>
            Powered by <b>Hugging Face Vision API</b> + <b>TensorFlow.js</b><br />
            Nhận diện chính xác cao — thú cưng, động vật hoang dã, gia súc
          </p>
          {!HF_TOKEN && (
            <div style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fef3c7', padding: '8px 18px', borderRadius: 20, fontSize: '0.82rem', color: '#92400e' }}>
              💡 Thêm <code>VITE_HF_API_KEY</code> vào .env.local để tăng độ chính xác và tốc độ
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: imageUrl ? '1fr 1fr' : '1fr', gap: 24 }}>
          {/* Upload */}
          <div>
            <div onClick={() => !analyzing && fileInputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f && !analyzing) handleFile(f); }}
              style={{ border: `2px dashed ${dragging ? '#111' : '#d1d5db'}`, borderRadius: 20, padding: imageUrl ? 12 : '52px 20px', textAlign: 'center', cursor: analyzing ? 'wait' : 'pointer', background: dragging ? '#f0f0f0' : '#faf9f7', transition: 'all 0.2s', position: 'relative' }}>
              {imageUrl
                ? <img src={imageUrl} alt="uploaded" style={{ width: '100%', maxHeight: 340, objectFit: 'contain', borderRadius: 14, display: 'block' }} />
                : (<>
                    <div style={{ fontSize: '4rem', marginBottom: 14 }}>📷</div>
                    <div style={{ fontWeight: 700, color: '#374151', marginBottom: 6, fontSize: '1.1rem' }}>Kéo & thả hoặc click chọn ảnh</div>
                    <div style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: 18 }}>Hỗ trợ: JPG, PNG, WEBP · Tối đa 10MB</div>
                    <div style={{ background: '#111', color: '#fff', display: 'inline-block', padding: '11px 28px', borderRadius: 50, fontWeight: 700, fontSize: '0.95rem' }}>📁 Chọn ảnh</div>
                  </>)}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            {imageUrl && (
              <button onClick={reset} style={{ marginTop: 10, width: '100%', background: '#f3f4f6', color: '#374151', border: 'none', padding: '10px', borderRadius: 50, fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>🔄 Thử ảnh khác</button>
            )}

            {/* Top 5 labels */}
            {rawLabels.length > 0 && (
              <div style={{ marginTop: 14, background: '#f9fafb', borderRadius: 14, padding: '14px 16px', border: '1px solid #e5e7eb' }}>
                <div style={{ fontWeight: 700, color: '#6b7280', fontSize: '0.8rem', marginBottom: 10 }}>
                  🔬 Kết quả AI · {modelUsed ? `Model: ${modelUsed.split('/')[1]}` : ''}
                </div>
                {rawLabels.map((l, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ width: 20, height: 20, borderRadius: '50%', background: i === 0 ? '#111' : '#e5e7eb', color: i === 0 ? '#fff' : '#9ca3af', fontSize: '0.68rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i+1}</span>
                    <span style={{ flex: 1, fontSize: '0.78rem', color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                      <div style={{ width: 60, height: 5, background: '#e5e7eb', borderRadius: 999 }}>
                        <div style={{ width: `${Math.round(l.score * 100)}%`, height: '100%', background: i === 0 ? '#22c55e' : '#94a3b8', borderRadius: 999 }} />
                      </div>
                      <span style={{ fontSize: '0.75rem', color: i === 0 ? '#166534' : '#9ca3af', fontWeight: i === 0 ? 700 : 400, minWidth: 32 }}>{Math.round(l.score * 100)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Result panel */}
          {(analyzing || result || notAnimal) && (
            <div>
              {analyzing && (
                <div style={{ background: '#fff', borderRadius: 20, padding: 32, border: '1px solid #f0ebe4', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, minHeight: 280, justifyContent: 'center' }}>
                  <div style={{ fontSize: '3.5rem', animation: 'pulse 1s infinite' }}>🔍</div>
                  <div style={{ fontWeight: 800, color: '#111', fontSize: '1.05rem' }}>AI đang phân tích...</div>
                  <div style={{ width: '100%', background: '#e5e7eb', borderRadius: 999, height: 8 }}>
                    <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg,#6366f1,#8b5cf6,#3b82f6)', borderRadius: 999, transition: 'width 0.5s' }} />
                  </div>
                  <div style={{ color: '#9ca3af', fontSize: '0.82rem' }}>{statusMsg}</div>
                </div>
              )}

              {!analyzing && notAnimal && (
                <div style={{ background: '#fff', borderRadius: 20, padding: 28, border: '1px solid #f0ebe4', textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: 12 }}>🤔</div>
                  <h3 style={{ fontWeight: 800, color: '#111', marginBottom: 10 }}>Không nhận ra động vật</h3>
                  <p style={{ color: '#888', lineHeight: 1.7, marginBottom: 16, fontSize: '0.88rem' }}>
                    Không phát hiện động vật trong ảnh. Thử:<br />
                    • Ảnh rõ nét, đủ ánh sáng<br />
                    • Động vật ở trung tâm khung hình<br />
                    • Không bị che khuất quá nhiều
                  </p>
                  {rawLabels.length > 0 && <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: 16 }}>AI thấy: {rawLabels[0]?.label} ({Math.round(rawLabels[0]?.score * 100)}%)</div>}
                  <button onClick={reset} style={{ background: '#111', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 50, fontWeight: 700, cursor: 'pointer' }}>Thử lại</button>
                </div>
              )}

              {!analyzing && result && (
                <div style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid #f0ebe4', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, padding: '14px 16px', background: result.color || '#f9fafb', borderRadius: 14 }}>
                    <span style={{ fontSize: '3rem', flexShrink: 0 }}>{result.icon}</span>
                    <div>
                      <div style={{ fontWeight: 900, color: '#111', fontSize: '1.25rem', lineHeight: 1.2 }}>{result.name}</div>
                      <div style={{ color: '#888', fontSize: '0.85rem', marginTop: 2 }}>{result.species}</div>
                      <div style={{ marginTop: 4, display: 'inline-block', background: result.confidence >= 80 ? '#dcfce7' : result.confidence >= 50 ? '#fef3c7' : '#fee2e2', color: result.confidence >= 80 ? '#166534' : result.confidence >= 50 ? '#92400e' : '#991b1b', padding: '2px 10px', borderRadius: 10, fontSize: '0.78rem', fontWeight: 700 }}>
                        Độ chính xác: {result.confidence}%
                      </div>
                    </div>
                  </div>

                  {/* Confidence bar */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ background: '#e5e7eb', borderRadius: 999, height: 10, overflow: 'hidden' }}>
                      <div style={{ width: `${result.confidence}%`, height: '100%', background: result.confidence >= 80 ? 'linear-gradient(90deg,#22c55e,#16a34a)' : result.confidence >= 50 ? '#f59e0b' : '#ef4444', borderRadius: 999, transition: 'width 1.2s ease' }} />
                    </div>
                  </div>

                  {/* Pet vs Wild warning */}
                  {!result.isPet && (
                    <div style={{ background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: 10, padding: '10px 14px', marginBottom: 14, fontSize: '0.82rem', color: '#92400e' }}>
                      ⚠️ Đây là <b>động vật hoang dã</b> — không nuôi làm thú cưng. Cần bảo tồn!
                    </div>
                  )}

                  {/* Info grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                    {[['🌍 Xuất xứ', result.origin], ['📏 Kích thước', result.size], ['⚖️ Cân nặng', result.weight], ['⏳ Tuổi thọ', result.lifespan]].map(([k,v]) => (
                      <div key={k as string} style={{ background: '#f9fafb', padding: '8px 12px', borderRadius: 10 }}>
                        <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{k}</div>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#111' }}>{v}</div>
                      </div>
                    ))}
                  </div>

                  {/* Traits */}
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 12 }}>
                    {result.temperament?.map((t: string) => <span key={t} style={{ background: '#f0ebe4', color: '#8b5e3c', padding: '3px 10px', borderRadius: 10, fontSize: '0.73rem', fontWeight: 600 }}>{t}</span>)}
                  </div>

                  {/* Care & Food */}
                  {result.isPet && (<>
                    <div style={{ background: '#f0fdf4', borderRadius: 10, padding: '10px 14px', marginBottom: 8, border: '1px solid #bbf7d0' }}>
                      <div style={{ fontSize: '0.73rem', color: '#166534', fontWeight: 700, marginBottom: 2 }}>🧴 Chăm sóc</div>
                      <div style={{ fontSize: '0.84rem', color: '#374151' }}>{result.care}</div>
                    </div>
                    <div style={{ background: '#fffbeb', borderRadius: 10, padding: '10px 14px', border: '1px solid #fde68a' }}>
                      <div style={{ fontSize: '0.73rem', color: '#92400e', fontWeight: 700, marginBottom: 2 }}>🍽️ Chế độ ăn</div>
                      <div style={{ fontSize: '0.84rem', color: '#374151' }}>{result.food}</div>
                    </div>
                  </>)}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Related products */}
        {result?.isPet && (
          <div style={{ marginTop: 40 }}>
            <h2 style={{ fontWeight: 800, color: '#111', marginBottom: 20, fontSize: '1.3rem' }}>
              🛍️ Sản phẩm phù hợp cho {result.species}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
              {relatedProducts.map(p => (
                <Link key={p.id} to={`/products/${p.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', border: '1px solid #f0ebe4', transition: 'transform 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-3px)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = '')}>
                    <div style={{ height: 120, overflow: 'hidden', background: '#f9fafb' }}>
                      <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => (e.currentTarget.style.display='none')} />
                    </div>
                    <div style={{ padding: '10px 12px' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#111', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                      <div style={{ fontWeight: 800, color: '#c7603a', fontSize: '0.9rem' }}>{fmt(p.price)}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};