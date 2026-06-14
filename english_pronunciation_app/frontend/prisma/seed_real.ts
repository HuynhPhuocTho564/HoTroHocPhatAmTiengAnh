import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fetchWordData(word: string) {
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (!res.ok) {
      console.log(`[API] Từ '${word}' không tìm thấy trên Free Dictionary.`);
      return { audio: '', ipa: '' };
    }
    const data = await res.json();
    let audio = '';
    let ipa = '';
    
    // Tìm URL audio hợp lệ đầu tiên
    const phoneticWithAudio = data[0]?.phonetics?.find((p: any) => p.audio && p.audio.trim() !== '');
    if (phoneticWithAudio) {
      audio = phoneticWithAudio.audio;
    }
    
    // Tìm IPA
    const phoneticWithText = data[0]?.phonetics?.find((p: any) => p.text);
    if (phoneticWithText) {
      ipa = phoneticWithText.text;
    }

    // Fallback: nếu không có audio thì thử dò các object khác
    if (!audio) {
      for (const entry of data) {
         const p = entry.phonetics?.find((p: any) => p.audio && p.audio.trim() !== '');
         if (p) {
           audio = p.audio;
           break;
         }
      }
    }

    return { audio, ipa };
  } catch (error) {
    console.error(`[API LỖI] Lỗi khi lấy từ ${word}:`, error);
    return { audio: '', ipa: '' };
  }
}

async function main() {
  console.log('Bắt đầu quá trình seed dữ liệu thực tế từ Free Dictionary API...');

  // 1. Tạo Cấp độ (Level)
  await prisma.level.upsert({
    where: { id: 'level-1-easy' },
    update: {},
    create: { id: 'level-1-easy', name: 'Dễ', description: 'Cấp độ cho người mới bắt đầu' }
  });

  // 2. Tạo Loại câu hỏi (QuestionType)
  await prisma.questionType.upsert({
    where: { id: 'qtype-1-mc' },
    update: {},
    create: { id: 'qtype-1-mc', name: 'Trắc nghiệm nghe', description: 'Nghe audio và chọn đáp án đúng' }
  });
  
  await prisma.questionType.upsert({
    where: { id: 'qtype-2-voice' },
    update: {},
    create: { id: 'qtype-2-voice', name: 'Thu âm', description: 'Đọc văn bản và hệ thống chấm điểm' }
  });

  await prisma.questionType.upsert({
    where: { id: 'qtype-3-minimal-pairs' },
    update: {},
    create: { id: 'qtype-3-minimal-pairs', name: 'Thử Thách Kép', description: 'Đọc liên tiếp cặp từ' }
  });

  // 3. Đảm bảo Topic 1 tồn tại
  await prisma.topic.upsert({
    where: { id: 'topic-1' },
    update: {},
    create: { id: 'topic-1', name: 'Nguyên âm đơn', description: '12 nguyên âm đơn cơ bản trong tiếng Anh' }
  });

  // 4. Tạo Learning Maps (6 Lộ trình) cho Topic "Nguyên âm đơn"
  const learningMaps = [
    { id: 'map-1-i', name: 'Bài 1: Phân biệt /iː/ và /ɪ/', requirement: 'Dễ' },
    { id: 'map-2-e', name: 'Bài 2: Phân biệt /e/ và /æ/', requirement: 'Dễ' },
    { id: 'map-3-a', name: 'Bài 3: Âm /ɑː/ /ʌ/ /ə/', requirement: 'Trung bình' },
    { id: 'map-4-o', name: 'Bài 4: Phân biệt /ɒ/ và /ɔː/', requirement: 'Trung bình' },
    { id: 'map-5-u', name: 'Bài 5: Phân biệt /ʊ/ và /uː/', requirement: 'Khó' },
    { id: 'map-6-er', name: 'Bài 6: Đặc trưng âm /ɜː/', requirement: 'Khó' }
  ];

  for (const map of learningMaps) {
    await prisma.learningMap.upsert({
      where: { id: map.id },
      update: { name: map.name, requirement: map.requirement },
      create: { id: map.id, name: map.name, requirement: map.requirement, status: 'ACTIVE' }
    });
  }

  // 5. Khởi tạo 4 Bài tập
  const exercises = [
    { id: 'ex-1-listen', name: 'Bài 1: Luyện Tai', desc: 'Nghe và phân biệt (Minimal Pairs)', type: 'listen', status: 'ACTIVE' },
    { id: 'ex-2-speak', name: 'Bài 2: Luyện Miệng', desc: 'Nhìn từ và phát âm chuẩn', type: 'speak', status: 'ACTIVE' },
    { id: 'ex-3-challenge', name: 'Bài 3: Thử Thách Kép', desc: 'Đọc liên tiếp cặp từ (Ship & Sheep)', type: 'speak', status: 'LOCKED' },
    { id: 'ex-4-realworld', name: 'Bài 4: Thực Chiến', desc: 'Đọc câu hoàn chỉnh', type: 'speak', status: 'LOCKED' }
  ];

  for (const ex of exercises) {
    await prisma.exercise.upsert({
      where: { id: ex.id },
      update: { name: ex.name, status: ex.status },
      create: {
        id: ex.id,
        name: ex.name,
        description: ex.desc,
        questionCount: 5,
        topicId: 'topic-1',
        levelId: 'level-1-easy',
        mapId: 'map-1-i',
        status: ex.status
      }
    });
  }

  // --- DỌN DẸP LỖI NHÂN ĐÔI BÀI TẬP ---
  try {
    await prisma.question.deleteMany({ where: { exerciseId: 'ex-3-minimal' } });
    await prisma.exercise.delete({ where: { id: 'ex-3-minimal' } });
  } catch (e) {}

  // --- LẤY DỮ LIỆU TỪ API VÀ TẠO CÂU HỎI --- //
  
  // Danh sách từ vựng /ɪ/ và /i:/
  const wordsShort = ['ship', 'dip', 'fit', 'hit', 'bit'];
  const wordsLong = ['sheep', 'deep', 'feet', 'heat', 'beat'];

  // Bài 1: Luyện Tai
  console.log('--- Đang xử lý Bài 1: Luyện Tai ---');
  // Xóa sạch câu hỏi cũ của bài 1 để tránh trùng lặp
  await prisma.question.deleteMany({
    where: { exerciseId: 'ex-1-listen' }
  });

  for (let i = 0; i < 5; i++) {
    const word1 = wordsShort[i];
    const word2 = wordsLong[i];
    const correctWord = Math.random() > 0.5 ? word1 : word2;
    const isShort = correctWord === word1;
    
    console.log(`Đang gọi API cho từ: ${correctWord}`);
    const apiData = await fetchWordData(correctWord);

    const contentJson = JSON.stringify({
      word: correctWord,
      audioUrl: apiData.audio || `https://api.dictionaryapi.dev/media/pronunciations/en/${correctWord}-us.mp3`,
      ipa: apiData.ipa || (isShort ? `/ɪ/` : `/iː/`),
      hint: isShort ? `Âm /ɪ/ ngắn, giật mạnh — không kéo dài.` : `Âm /iː/ kéo dài hơn — môi căng, lưỡi đẩy lên cao phía trước.`,
      options: [
        { id: 'opt-1', text: '/ɪ/', isCorrect: isShort },
        { id: 'opt-2', text: '/iː/', isCorrect: !isShort }
      ]
    });

    await prisma.question.create({
      data: {
        id: `q-1-${correctWord}-${Date.now()}`,
        name: `Từ này chứa âm nào?`,
        content: contentJson,
        status: 'ACTIVE',
        score: 10,
        answer: isShort ? '/ɪ/' : '/iː/',
        typeId: 'qtype-1-mc',
        exerciseId: 'ex-1-listen'
      }
    });
  }

  // Bài 2: Luyện Miệng
  console.log('--- Đang xử lý Bài 2: Luyện Miệng ---');
  await prisma.question.deleteMany({
    where: { exerciseId: 'ex-2-speak' }
  });

  for (let i = 0; i < 5; i++) {
    const word = wordsLong[i]; // Lấy 5 từ dài để tập đọc (/i:/)
    console.log(`Đang gọi API cho từ (Bài 2): ${word}`);
    const apiData = await fetchWordData(word);
    
    const audioUrl = apiData.audio || `https://api.dictionaryapi.dev/media/pronunciations/en/${word}-us.mp3`;
    const ipa = apiData.ipa || `/iː/`;
    
    const hintText = `Âm /iː/ cần kéo dài hơn — môi căng, lưỡi đẩy lên cao phía trước.`;

    const contentJson = JSON.stringify({
      word: word,
      audioUrl: audioUrl,
      ipa: ipa,
      hint: hintText
    });
    
    await prisma.question.upsert({
      where: { id: `q-2-${word}` },
      update: {
        content: contentJson,
        name: `Hãy đọc từ này thành tiếng`,
        answer: word
      },
      create: {
        id: `q-2-${word}`,
        name: `Hãy đọc từ này thành tiếng`,
        content: contentJson,
        status: 'ACTIVE',
        score: 10,
        answer: word,
        typeId: 'qtype-2-voice',
        exerciseId: 'ex-2-speak'
      }
    });
  }

  // Bài 3: Thử Thách Kép
  console.log('--- Đang xử lý Bài 3: Thử Thách Kép ---');
  await prisma.question.deleteMany({
    where: { exerciseId: 'ex-3-challenge' }
  });

  for (let i = 0; i < 5; i++) {
    const word1 = wordsShort[i];
    const word2 = wordsLong[i];
    console.log(`Đang gọi API cho cặp từ: ${word1} - ${word2}`);
    
    const apiData1 = await fetchWordData(word1);
    const apiData2 = await fetchWordData(word2);

    const contentJson = JSON.stringify([
      {
        word: word1,
        audioUrl: apiData1.audio || `https://api.dictionaryapi.dev/media/pronunciations/en/${word1}-us.mp3`,
        ipa: apiData1.ipa || `/ɪ/`,
        hint: `Âm ngắn, giật mạnh.`
      },
      {
        word: word2,
        audioUrl: apiData2.audio || `https://api.dictionaryapi.dev/media/pronunciations/en/${word2}-us.mp3`,
        ipa: apiData2.ipa || `/iː/`,
        hint: `Âm dài, môi căng.`
      }
    ]);
    
    await prisma.question.upsert({
      where: { id: `q-3-pair-${i}` },
      update: {
        content: contentJson,
        answer: `${word1} ${word2}`,
        typeId: 'qtype-3-minimal-pairs',
        exerciseId: 'ex-3-challenge'
      },
      create: {
        id: `q-3-pair-${i}`,
        name: `Hãy nghe và đọc liên tiếp 2 từ dưới đây:`,
        content: contentJson,
        status: 'ACTIVE',
        score: 20,
        answer: `${word1} ${word2}`,
        typeId: 'qtype-3-minimal-pairs',
        exerciseId: 'ex-3-challenge'
      }
    });
  }

  // Bài 4: Thực Chiến
  console.log('--- Đang xử lý Bài 4: Thực Chiến ---');
  const sentences = [
    { text: "The ship is small", ans: "The ship is small" },
    { text: "Look at the sheep", ans: "Look at the sheep" },
    { text: "My feet are hot", ans: "My feet are hot" }
  ];

  for (let i = 0; i < sentences.length; i++) {
    await prisma.question.upsert({
      where: { id: `q-4-sent-${i}` },
      update: {},
      create: {
        id: `q-4-sent-${i}`,
        name: `Đọc câu hoàn chỉnh`,
        content: sentences[i].text,
        status: 'ACTIVE',
        score: 30,
        answer: sentences[i].ans,
        typeId: 'qtype-2-voice',
        exerciseId: 'ex-4-realworld'
      }
    });
  }

  console.log('Hoàn thành Seed dữ liệu thực tế từ API!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
