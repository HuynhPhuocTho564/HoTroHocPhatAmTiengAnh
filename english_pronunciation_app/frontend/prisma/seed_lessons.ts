/**
 * SEED LESSONS - Script seed hệ thống bài học đầy đủ
 * 
 * Pipeline:
 * 1. Seed QuestionTypes
 * 2. Seed Topics (4 chủ đề)
 * 3. Seed Phonemes (44 âm IPA)
 * 4. Seed SoundGroups (25 nhóm)
 * 5. Seed WordItems, MinimalPairs, SentenceItems
 * 6. Generate LearningMaps (25 maps)
 * 7. Generate Exercises (100 bài = 25 groups × 4 modes)
 * 8. Generate Questions từ QuestionBankItems
 * 
 * Chạy: npx prisma db seed
 */

import { PrismaClient } from "@prisma/client";
import {
  TOPICS,
  SOUND_GROUPS,
  EXERCISE_MODES,
  PHONEMES,
  getAllSoundGroups,
  getSoundGroupsByTopic,
} from "./lesson-catalog";
import {
  LESSON_CONTENT_BY_SOUND_GROUP,
  getContentBySoundGroup,
  type WordItemData,
  type MinimalPairData,
  type SentenceItemData,
} from "./lesson-content";

const prisma = new PrismaClient();

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateExerciseId(soundGroupId: string, modeId: string): string {
  // Example: "ex-map-t1-g01-i-ih-listen_choose"
  return `ex-${soundGroupId}-${modeId}`;
}

function generateQuestionId(exerciseId: string, index: number): string {
  // Example: "q-ex-map-t1-g01-i-ih-listen_choose-001"
  return `${exerciseId.replace("ex-", "q-")}-${String(index).padStart(3, "0")}`;
}

// ============================================================================
// SEED FUNCTIONS
// ============================================================================

async function seedQuestionTypes() {
  console.log("📦 Seeding Question Types...");

  const questionTypes = [
    {
      id: "qtype-1-mc",
      name: "Trắc nghiệm nghe",
      description: "Nghe audio và chọn đáp án đúng (IPA hoặc từ)",
    },
    {
      id: "qtype-2-voice",
      name: "Đọc từ hoặc câu",
      description: "Đọc từ đơn hoặc câu theo yêu cầu",
    },
    {
      id: "qtype-3-minimal-pairs",
      name: "Đọc cặp từ",
      description: "Đọc cặp minimal pair để phân biệt âm",
    },
  ];

  for (const qt of questionTypes) {
    await prisma.questionType.upsert({
      where: { id: qt.id },
      update: qt,
      create: qt,
    });
  }

  console.log(`   ✓ ${questionTypes.length} QuestionTypes created`);
}

async function seedTopics() {
  console.log("📚 Seeding Topics...");

  for (const topic of TOPICS) {
    await prisma.topic.upsert({
      where: { id: topic.id },
      update: {
        name: topic.name,
        description: topic.description,
      },
      create: {
        id: topic.id,
        name: topic.name,
        description: topic.description,
      },
    });
  }

  console.log(`   ✓ ${TOPICS.length} Topics created`);
}

async function seedPhonemes() {
  console.log("🔤 Seeding Phonemes...");

  for (const phoneme of PHONEMES) {
    await prisma.phoneme.upsert({
      where: { symbol: phoneme.ipa },
      update: {
        name: phoneme.ipa,
        category: phoneme.type,
        description: phoneme.description,
        status: "ACTIVE",
      },
      create: {
        symbol: phoneme.ipa,
        name: phoneme.ipa,
        category: phoneme.type,
        description: phoneme.description,
        status: "ACTIVE",
      },
    });
  }

  console.log(`   ✓ ${PHONEMES.length} Phonemes created`);
}

async function seedSoundGroups() {
  console.log("🎵 Seeding Sound Groups...");

  for (const sg of SOUND_GROUPS) {
    // Upsert SoundGroup
    await prisma.soundGroup.upsert({
      where: { id: sg.id },
      update: {
        name: sg.name,
        description: sg.description,
        orderIndex: sg.orderIndex,
        status: "DRAFT", // Mặc định DRAFT, sẽ chuyển ACTIVE khi có content đầy đủ
        topicId: sg.topicId,
      },
      create: {
        id: sg.id,
        name: sg.name,
        description: sg.description,
        orderIndex: sg.orderIndex,
        status: "DRAFT",
        topicId: sg.topicId,
      },
    });

    // Link Phonemes to SoundGroup
    for (let i = 0; i < sg.targetPhonemes.length; i++) {
      const ipaSymbol = sg.targetPhonemes[i];
      const phoneme = await prisma.phoneme.findUnique({ where: { symbol: ipaSymbol } });
      
      if (phoneme) {
        await prisma.soundGroupPhoneme.upsert({
          where: {
            soundGroupId_phonemeId: {
              soundGroupId: sg.id,
              phonemeId: phoneme.id,
            },
          },
          update: {
            orderIndex: i + 1,
            role: i === 0 ? "primary" : "secondary",
          },
          create: {
            soundGroupId: sg.id,
            phonemeId: phoneme.id,
            orderIndex: i + 1,
            role: i === 0 ? "primary" : "secondary",
          },
        });
      }
    }
  }

  console.log(`   ✓ ${SOUND_GROUPS.length} SoundGroups created`);
}

async function seedWordItems(soundGroupId: string, words: WordItemData[]) {
  for (const word of words) {
    // Lấy phoneme đầu tiên từ targetPhonemes
    const firstPhonemeSymbol = word.targetPhonemes[0];
    const phoneme = await prisma.phoneme.findUnique({ where: { symbol: firstPhonemeSymbol } });
    
    if (!phoneme) {
      console.warn(`   ⚠️  Phoneme ${firstPhonemeSymbol} not found for word ${word.word}, skipping...`);
      continue;
    }

    await prisma.wordItem.upsert({
      where: {
        word_ipa_phonemeId: {
          word: word.word,
          ipa: word.ipa,
          phonemeId: phoneme.id,
        },
      },
      update: {
        audioUrl: word.audioUrl,
        meaningVi: word.exampleSentence, // Tạm dùng exampleSentence làm meaningVi
        difficulty: word.difficulty === 2 ? "EASY" : word.difficulty >= 5 ? "HARD" : "MEDIUM",
        status: word.status,
        audioSource: word.sourceType === "FREE_API" ? "FREE_DICTIONARY" : "MANUAL",
        sourceType: word.sourceType,
        sourceUrl: word.sourceUrl,
        reviewNote: word.reviewNote,
      },
      create: {
        word: word.word,
        ipa: word.ipa,
        phonemeId: phoneme.id,
        audioUrl: word.audioUrl,
        meaningVi: word.exampleSentence,
        difficulty: word.difficulty === 2 ? "EASY" : word.difficulty >= 5 ? "HARD" : "MEDIUM",
        status: word.status,
        audioSource: word.sourceType === "FREE_API" ? "FREE_DICTIONARY" : "MANUAL",
        sourceType: word.sourceType,
        sourceUrl: word.sourceUrl,
        reviewNote: word.reviewNote,
      },
    });
  }
}

async function seedMinimalPairs(soundGroupId: string, pairs: MinimalPairData[]) {
  for (const pair of pairs) {
    // Find WordItems
    const wordA = await prisma.wordItem.findFirst({ where: { word: pair.word1, ipa: pair.ipa1 } });
    const wordB = await prisma.wordItem.findFirst({ where: { word: pair.word2, ipa: pair.ipa2 } });

    if (!wordA || !wordB) {
      console.warn(`   ⚠️  Words not found for pair ${pair.word1}/${pair.word2}, skipping...`);
      continue;
    }

    await prisma.minimalPair.upsert({
      where: {
        soundGroupId_wordAId_wordBId: {
          soundGroupId: soundGroupId,
          wordAId: wordA.id,
          wordBId: wordB.id,
        },
      },
      update: {
        note: pair.explanation,
        difficulty: pair.difficulty === 2 ? "EASY" : pair.difficulty >= 5 ? "HARD" : "MEDIUM",
        status: pair.status,
      },
      create: {
        soundGroupId: soundGroupId,
        wordAId: wordA.id,
        wordBId: wordB.id,
        note: pair.explanation,
        difficulty: pair.difficulty === 2 ? "EASY" : pair.difficulty >= 5 ? "HARD" : "MEDIUM",
        status: pair.status,
      },
    });
  }
}

async function seedSentenceItems(soundGroupId: string, sentences: SentenceItemData[]) {
  for (const sent of sentences) {
    await prisma.sentenceItem.upsert({
      where: {
        id: `sent-${soundGroupId}-${sent.sentence.substring(0, 20).replace(/\s/g, "-")}`,
      },
      update: {
        text: sent.sentence,
        targetWords: JSON.parse(JSON.stringify(sent.targetWords)),
        difficulty: sent.difficulty === 2 ? "EASY" : sent.difficulty >= 5 ? "HARD" : "MEDIUM",
        status: sent.status,
        sourceType: sent.sourceType,
        reviewNote: sent.reviewNote,
      },
      create: {
        id: `sent-${soundGroupId}-${sent.sentence.substring(0, 20).replace(/\s/g, "-")}`,
        text: sent.sentence,
        soundGroupId: soundGroupId,
        targetWords: JSON.parse(JSON.stringify(sent.targetWords)),
        difficulty: sent.difficulty === 2 ? "EASY" : sent.difficulty >= 5 ? "HARD" : "MEDIUM",
        status: sent.status,
        sourceType: sent.sourceType,
        reviewNote: sent.reviewNote,
      },
    });
  }
}

async function seedLessonContent() {
  console.log("📝 Seeding Lesson Content (Words, Pairs, Sentences)...");

  let totalWords = 0;
  let totalPairs = 0;
  let totalSentences = 0;

  for (const soundGroupId of Object.keys(LESSON_CONTENT_BY_SOUND_GROUP)) {
    const content = getContentBySoundGroup(soundGroupId);
    if (!content) continue;

    await seedWordItems(soundGroupId, content.words);
    await seedMinimalPairs(soundGroupId, content.minimalPairs);
    await seedSentenceItems(soundGroupId, content.sentences);

    totalWords += content.words.length;
    totalPairs += content.minimalPairs.length;
    totalSentences += content.sentences.length;
  }

  console.log(`   ✓ ${totalWords} WordItems created`);
  console.log(`   ✓ ${totalPairs} MinimalPairs created`);
  console.log(`   ✓ ${totalSentences} SentenceItems created`);
}

async function generateLearningMaps() {
  console.log("🗺️  Generating Learning Maps...");

  // Lấy hoặc tạo default level
  let defaultLevel = await prisma.level.findFirst({ where: { name: "Beginner" } });
  if (!defaultLevel) {
    defaultLevel = await prisma.level.create({
      data: {
        name: "Beginner",
        description: "Cấp độ người mới bắt đầu",
      },
    });
  }

  for (const sg of SOUND_GROUPS) {
    const mapId = `map-${sg.id}`;

    // Check if content exists for this sound group
    const content = getContentBySoundGroup(sg.id);
    const hasContent = content && content.words.length > 0;

    await prisma.learningMap.upsert({
      where: { id: mapId },
      update: {
        name: sg.name,
        requirement: sg.description,
        status: hasContent ? "ACTIVE" : "DRAFT",
      },
      create: {
        id: mapId,
        name: sg.name,
        requirement: sg.description,
        status: hasContent ? "ACTIVE" : "DRAFT",
      },
    });
  }

  console.log(`   ✓ ${SOUND_GROUPS.length} LearningMaps generated`);
}

async function generateExercises() {
  console.log("📋 Generating Exercises (4 modes per sound group)...");

  let totalExercises = 0;

  // Lấy default topic và level
  const defaultTopic = await prisma.topic.findFirst();
  const defaultLevel = await prisma.level.findFirst();
  
  if (!defaultTopic || !defaultLevel) {
    console.error("   ❌ Need at least 1 Topic and 1 Level to create exercises");
    return;
  }

  for (const sg of SOUND_GROUPS) {
    const mapId = `map-${sg.id}`;
    const content = getContentBySoundGroup(sg.id);
    const hasContent = content && content.words.length > 0;
    const questionCount = hasContent ? 5 : 0;

    for (const mode of EXERCISE_MODES) {
      const exerciseId = generateExerciseId(sg.id, mode.id);
      const exerciseName = `${sg.name} - ${mode.name}`;

      await prisma.exercise.upsert({
        where: { id: exerciseId },
        update: {
          name: exerciseName,
          description: mode.description,
          questionCount: questionCount,
          status: hasContent ? "ACTIVE" : "DRAFT",
        },
        create: {
          id: exerciseId,
          name: exerciseName,
          description: mode.description,
          topicId: defaultTopic.id,
          levelId: defaultLevel.id,
          mapId: mapId,
          questionCount: questionCount,
          timeLimit: 300, // 5 minutes
          status: hasContent ? "ACTIVE" : "DRAFT",
        },
      });

      totalExercises++;
    }
  }

  console.log(`   ✓ ${totalExercises} Exercises generated (${SOUND_GROUPS.length} groups × ${EXERCISE_MODES.length} modes)`);
}

async function generateQuestions() {
  console.log("❓ Generating Questions from content...");

  let totalQuestions = 0;

  // Lấy question types
  const qtypes = await prisma.questionType.findMany();
  const qtypeMap = Object.fromEntries(qtypes.map(qt => [qt.id, qt]));

  for (const sg of SOUND_GROUPS) {
    const content = getContentBySoundGroup(sg.id);
    if (!content || content.words.length === 0) {
      console.log(`   ⏭️  Skipping ${sg.id} (no content)`);
      continue;
    }

    // Generate questions for each mode
    for (const mode of EXERCISE_MODES) {
      const exerciseId = generateExerciseId(sg.id, mode.id);
      const exercise = await prisma.exercise.findUnique({ where: { id: exerciseId } });
      
      if (!exercise) continue;

      let questionIndex = 1;

      if (mode.id === "listen_choose") {
        // Generate MC questions from words
        for (const word of content.words.slice(0, 5)) {
          const questionId = generateQuestionId(exerciseId, questionIndex);
          
          await prisma.question.upsert({
            where: { id: questionId },
            update: {
              content: `Nghe và chọn từ đúng: ${word.word}`,
              answer: word.word,
              score: 10,
              status: "ACTIVE",
            },
            create: {
              id: questionId,
              name: `Q${questionIndex}`,
              content: `Nghe và chọn từ đúng: ${word.word}`,
              answer: word.word,
              score: 10,
              status: "ACTIVE",
              typeId: mode.questionTypeId,
              exerciseId: exerciseId,
            },
          });

          // Create answer options (word + 3 distractors)
          const options = [word.word, "distractor1", "distractor2", "distractor3"];
          for (const opt of options) {
            await prisma.answerOption.create({
              data: {
                content: opt,
                questionId: questionId,
              },
            }).catch(() => {}); // Ignore duplicates
          }

          questionIndex++;
          totalQuestions++;
        }
      }

      if (mode.id === "speak_word") {
        // Generate speak_word questions
        for (const word of content.words.slice(0, 5)) {
          const questionId = generateQuestionId(exerciseId, questionIndex);
          
          await prisma.question.upsert({
            where: { id: questionId },
            update: {
              content: `Đọc từ: ${word.word} (${word.ipa})`,
              answer: word.word,
              score: 15,
              status: "ACTIVE",
            },
            create: {
              id: questionId,
              name: `Q${questionIndex}`,
              content: `Đọc từ: ${word.word} (${word.ipa})`,
              answer: word.word,
              score: 15,
              status: "ACTIVE",
              typeId: mode.questionTypeId,
              exerciseId: exerciseId,
            },
          });

          questionIndex++;
          totalQuestions++;
        }
      }

      if (mode.id === "speak_minimal_pair") {
        // Generate minimal pair questions
        for (const pair of content.minimalPairs.slice(0, 4)) {
          const questionId = generateQuestionId(exerciseId, questionIndex);
          
          await prisma.question.upsert({
            where: { id: questionId },
            update: {
              content: `Đọc cặp từ: ${pair.word1} (${pair.ipa1}) - ${pair.word2} (${pair.ipa2})`,
              answer: `${pair.word1}, ${pair.word2}`,
              score: 20,
              status: "ACTIVE",
            },
            create: {
              id: questionId,
              name: `Q${questionIndex}`,
              content: `Đọc cặp từ: ${pair.word1} (${pair.ipa1}) - ${pair.word2} (${pair.ipa2})`,
              answer: `${pair.word1}, ${pair.word2}`,
              score: 20,
              status: "ACTIVE",
              typeId: mode.questionTypeId,
              exerciseId: exerciseId,
            },
          });

          questionIndex++;
          totalQuestions++;
        }
      }

      if (mode.id === "speak_sentence") {
        // Generate sentence questions
        for (const sent of content.sentences.slice(0, 4)) {
          const questionId = generateQuestionId(exerciseId, questionIndex);
          
          await prisma.question.upsert({
            where: { id: questionId },
            update: {
              content: `Đọc câu: ${sent.sentence}`,
              answer: sent.sentence,
              score: 25,
              status: "ACTIVE",
            },
            create: {
              id: questionId,
              name: `Q${questionIndex}`,
              content: `Đọc câu: ${sent.sentence}`,
              answer: sent.sentence,
              score: 25,
              status: "ACTIVE",
              typeId: mode.questionTypeId,
              exerciseId: exerciseId,
            },
          });

          questionIndex++;
          totalQuestions++;
        }
      }
    }
  }

  console.log(`   ✓ ${totalQuestions} Questions generated`);
}

// ============================================================================
// MAIN SEED FUNCTION
// ============================================================================

async function main() {
  console.log("🌱 Starting lesson seed...\n");

  try {
    await seedQuestionTypes();
    await seedTopics();
    await seedPhonemes();
    await seedSoundGroups();
    await seedLessonContent();
    await generateLearningMaps();
    await generateExercises();
    await generateQuestions();

    console.log("\n✅ Lesson seed completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   - ${TOPICS.length} Topics`);
    console.log(`   - ${PHONEMES.length} Phonemes`);
    console.log(`   - ${SOUND_GROUPS.length} Sound Groups`);
    console.log(`   - ${SOUND_GROUPS.length} Learning Maps`);
    console.log(`   - ${SOUND_GROUPS.length * EXERCISE_MODES.length} Exercises`);
    console.log(`   - MVP: 4 sound groups with full content (16 lessons ACTIVE)`);
  } catch (error) {
    console.error("❌ Error during seed:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
