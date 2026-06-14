import React from 'react';
import { prisma } from '@/lib/prisma';
import LearningMapClient, { TopicUI, LearningMapUI } from './LearningMapClient';

export default async function LearningMapPage() {
  // 1. Lấy dữ liệu Topics và Exercises từ DB
  const topicsDB = await prisma.topic.findMany({
    include: {
      exercises: {
        include: {
          map: true
        }
      }
    }
  });

  // 2. Lấy toàn bộ Learning Maps
  const allMaps = await prisma.learningMap.findMany({
    include: {
      exercises: true
    }
  });

  // 3. Format dữ liệu để đưa vào UI
  const topics: TopicUI[] = topicsDB.map((topic: any) => {
    const mapMap = new Map<string, LearningMapUI>();
    
    // Gom nhóm các bài tập theo LearningMap
    topic.exercises.forEach((ex: any) => {
      if (ex.map) {
        if (!mapMap.has(ex.map.id)) {
          mapMap.set(ex.map.id, {
            id: ex.map.id,
            name: ex.map.name,
            requirement: ex.map.requirement,
            exercises: []
          });
        }
        mapMap.get(ex.map.id)!.exercises.push({
          id: ex.id,
          name: ex.name,
          description: ex.description,
          status: ex.status
        });
      }
    });

    // Hardcode cho Topic 1
    if (topic.id === 'topic-1') {
       allMaps.forEach((m: any) => {
         if (!mapMap.has(m.id)) {
           mapMap.set(m.id, {
             id: m.id,
             name: m.name,
             requirement: m.requirement,
             exercises: m.exercises.map((ex: any) => ({
               id: ex.id,
               name: ex.name,
               description: ex.description,
               status: ex.status
             }))
           });
         }
       });
    }

    // Sắp xếp các Map theo tên (Bài 1, Bài 2...)
    const sortedMaps = Array.from(mapMap.values()).sort((a, b) => a.name.localeCompare(b.name));
    
    // Sắp xếp Exercises bên trong mỗi Map theo thứ tự Bài 1 -> Bài 4
    sortedMaps.forEach(m => {
       m.exercises.sort((a, b) => a.name.localeCompare(b.name));
    });

    return {
      id: topic.id,
      name: topic.name,
      description: topic.description,
      maps: sortedMaps
    };
  });

  // Thêm dữ liệu giả cho các Topic khác (do ta chưa seed hết) để UI đẹp hơn
  if (topics.length < 5) {
     topics.push({ id: 'dummy-2', name: 'Nguyên âm đôi', description: '8 nguyên âm đôi (diphthongs)', maps: [] });
     topics.push({ id: 'dummy-3', name: 'Phụ âm vô thanh', description: 'Phụ âm không rung dây thanh', maps: [] });
     topics.push({ id: 'dummy-4', name: 'Phụ âm hữu thanh', description: 'Phụ âm rung dây thanh', maps: [] });
  }

  return <LearningMapClient topics={topics} />;
}
