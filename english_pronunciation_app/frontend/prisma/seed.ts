import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Bắt đầu quá trình seed dữ liệu...');

  // 1. Tạo Cấp độ (Level)
  const levelEasy = await prisma.level.upsert({
    where: { id: 'level-1-easy' },
    update: {},
    create: { id: 'level-1-easy', name: 'Dễ', description: 'Cấp độ cho người mới bắt đầu' }
  });

  // 2. Tạo Loại câu hỏi (QuestionType)
  const qTypeMultipleChoice = await prisma.questionType.upsert({
    where: { id: 'qtype-1-mc' },
    update: {},
    create: { id: 'qtype-1-mc', name: 'Trắc nghiệm nghe', description: 'Nghe audio và chọn đáp án đúng' }
  });
  
  const qTypeVoice = await prisma.questionType.upsert({
    where: { id: 'qtype-2-voice' },
    update: {},
    create: { id: 'qtype-2-voice', name: 'Thu âm', description: 'Đọc văn bản và hệ thống chấm điểm' }
  });

  // 3. Tạo 5 Topics (Chủ đề)
  const topics = [
    { id: 'topic-1', name: 'Nguyên âm đơn', description: '12 nguyên âm đơn cơ bản trong tiếng Anh' },
    { id: 'topic-2', name: 'Nguyên âm đôi', description: '8 nguyên âm đôi cơ bản' },
    { id: 'topic-3', name: 'Phụ âm vô thanh', description: 'Các phụ âm không rung dây thanh quản' },
    { id: 'topic-4', name: 'Phụ âm hữu thanh', description: 'Các phụ âm làm rung dây thanh quản' },
    { id: 'topic-5', name: 'Trọng âm & Ngữ điệu', description: 'Kỹ năng nâng cao' }
  ];

  for (const t of topics) {
    await prisma.topic.upsert({
      where: { id: t.id },
      update: { name: t.name, description: t.description },
      create: t
    });
  }

  // 4. Tạo Learning Map cho "Nguyên âm đơn"
  const map1 = await prisma.learningMap.upsert({
    where: { id: 'map-1-i' },
    update: {},
    create: { 
      id: 'map-1-i', 
      name: 'Phân biệt /ɪ/ và /i:/', 
      requirement: 'Cơ bản', 
      status: 'ACTIVE' 
    }
  });

  await prisma.learningMap.upsert({
    where: { id: 'map-2-u' },
    update: {},
    create: { id: 'map-2-u', name: 'Phân biệt /ʊ/ và /u:/', requirement: 'Cơ bản', status: 'ACTIVE' }
  });
  
  await prisma.learningMap.upsert({
    where: { id: 'map-3-e' },
    update: {},
    create: { id: 'map-3-e', name: 'Phân biệt /e/ và /æ/', requirement: 'Cơ bản', status: 'ACTIVE' }
  });

  // 5. Tạo 4 Exercises (Bài 1, 2, 3, 4) cho map-1-i (Phân biệt /ɪ/ và /i:/)
  const exercisesData = [
    {
      id: 'ex-1-listen',
      name: 'Bài 1: Luyện Tai',
      description: 'Nghe và phân biệt cặp âm tối thiểu (Minimal Pairs)',
      questionCount: 5,
      topicId: 'topic-1',
      levelId: 'level-1-easy',
      mapId: 'map-1-i',
      status: 'ACTIVE'
    },
    {
      id: 'ex-2-speak',
      name: 'Bài 2: Luyện Miệng',
      description: 'Nhìn từ vựng và phát âm chuẩn (cần 80% để mở bài 3)',
      questionCount: 5,
      topicId: 'topic-1',
      levelId: 'level-1-easy',
      mapId: 'map-1-i',
      status: 'ACTIVE'
    },
    {
      id: 'ex-3-challenge',
      name: 'Bài 3: Thử Thách Kép',
      description: 'Đọc liên tiếp cặp từ Minimal Pairs (Ship & Sheep)',
      questionCount: 5,
      topicId: 'topic-1',
      levelId: 'level-1-easy',
      mapId: 'map-1-i',
      status: 'LOCKED' // Trạng thái khóa, cần code frontend/backend xử lý mở khóa
    },
    {
      id: 'ex-4-realworld',
      name: 'Bài 4: Thực Chiến',
      description: 'Đọc câu hoàn chỉnh trong ngữ cảnh thực tế',
      questionCount: 3,
      topicId: 'topic-1',
      levelId: 'level-1-easy',
      mapId: 'map-1-i',
      status: 'LOCKED'
    }
  ];

  for (const ex of exercisesData) {
    await prisma.exercise.upsert({
      where: { id: ex.id },
      update: { status: ex.status, name: ex.name, description: ex.description },
      create: ex
    });
  }

  // 6. Tạo Câu hỏi (Questions) cho Bài 1: Luyện Tai
  const q1 = await prisma.question.upsert({
    where: { id: 'q-1-ship' },
    update: {},
    create: {
      id: 'q-1-ship',
      name: 'Nghe và chọn từ đúng',
      content: '/audio/ship.mp3', // Mock URL
      status: 'ACTIVE',
      score: 10,
      answer: 'Ship',
      typeId: 'qtype-1-mc',
      exerciseId: 'ex-1-listen',
    }
  });

  // Thêm Answer Options cho Q1
  await prisma.answerOption.upsert({
    where: { id: 'opt-1-ship' },
    update: {},
    create: { id: 'opt-1-ship', content: 'Ship', questionId: 'q-1-ship' }
  });
  await prisma.answerOption.upsert({
    where: { id: 'opt-2-sheep' },
    update: {},
    create: { id: 'opt-2-sheep', content: 'Sheep', questionId: 'q-1-ship' }
  });

  // 7. Tạo Câu hỏi cho Bài 2: Luyện Miệng
  await prisma.question.upsert({
    where: { id: 'q-2-speak-ship' },
    update: {},
    create: {
      id: 'q-2-speak-ship',
      name: 'Phát âm từ sau',
      content: 'Ship', 
      status: 'ACTIVE',
      score: 10,
      answer: 'Ship', // Kỳ vọng Speech API trả về từ này
      typeId: 'qtype-2-voice',
      exerciseId: 'ex-2-speak',
    }
  });

  // 8. Tạo Câu hỏi cho Bài 3: Thử Thách Kép
  await prisma.question.upsert({
    where: { id: 'q-3-challenge' },
    update: {},
    create: {
      id: 'q-3-challenge',
      name: 'Phát âm liên tiếp cặp từ sau',
      content: 'Ship - Sheep', 
      status: 'ACTIVE',
      score: 20,
      answer: 'Ship Sheep',
      typeId: 'qtype-2-voice',
      exerciseId: 'ex-3-challenge',
    }
  });

  // 9. Tạo Câu hỏi cho Bài 4: Thực Chiến
  await prisma.question.upsert({
    where: { id: 'q-4-realworld' },
    update: {},
    create: {
      id: 'q-4-realworld',
      name: 'Đọc câu sau',
      content: 'The ship is carrying a sheep.', 
      status: 'ACTIVE',
      score: 30,
      answer: 'The ship is carrying a sheep',
      typeId: 'qtype-2-voice',
      exerciseId: 'ex-4-realworld',
    }
  });

  console.log('Seed dữ liệu thành công! Đã tạo 5 Topics, 3 Maps và 4 Bài học mẫu.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
