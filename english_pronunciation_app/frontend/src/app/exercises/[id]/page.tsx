import React from 'react';
import { prisma } from '@/lib/prisma';
import ExerciseEngineClient from './ExerciseEngineClient';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ExercisePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Lấy chi tiết bài tập cùng danh sách câu hỏi và các phương án
  const exercise = await prisma.exercise.findUnique({
    where: { id },
    include: {
      questions: {
        include: {
          options: true,
          type: true
        }
      }
    }
  });

  if (!exercise) {
    notFound();
  }

  // Format dữ liệu gửi xuống Client Component
  const exerciseData = {
    id: exercise.id,
    name: exercise.name,
    description: exercise.description,
    questions: exercise.questions.map(q => ({
      id: q.id,
      name: q.name,
      content: q.content, // audioUrl hoặc text
      type: q.type.id, // qtype-1-mc (Trắc nghiệm), qtype-2-voice (Thu âm)
      answer: q.answer,
      score: q.score,
      options: q.options.map(opt => ({
        id: opt.id,
        content: opt.content
      }))
    }))
  };

  return <ExerciseEngineClient exercise={exerciseData} />;
}
