import assert from "node:assert/strict";
import test from "node:test";
import { LESSON_CONTENT_BY_SOUND_GROUP, getContentBySoundGroup } from "../../../prisma/lesson-content";

const NEW_GROUPS = [
  "map-t1-g03-central",
  "map-t1-g05-u-uh",
  "map-t1-g06-er",
  "map-t1-g07-ei-ai",
  "map-t1-g08-oi-au",
  "map-t1-g09-ou-ea",
  "map-t1-g10-ia-ua",
];

test("7 nhóm CĐ1 mới có trong LESSON_CONTENT_BY_SOUND_GROUP", () => {
  for (const id of NEW_GROUPS) {
    assert.ok(LESSON_CONTENT_BY_SOUND_GROUP[id as keyof typeof LESSON_CONTENT_BY_SOUND_GROUP], `Thiếu nhóm ${id}`);
  }
});

test("mỗi nhóm mới có words/pairs/sentences không rỗng", () => {
  for (const id of NEW_GROUPS) {
    const content = getContentBySoundGroup(id);
    assert.ok(content, `getContentBySoundGroup(${id}) trả undefined`);
    assert.ok(content!.words.length >= 8, `${id}: words >= 8 (hiện ${content!.words.length})`);
    assert.ok(content!.sentences.length >= 3, `${id}: sentences >= 3 (hiện ${content!.sentences.length})`);
    // g06 /ɜː/ không cặp → pairs có thể 0; các nhóm khác >= 4
    if (id !== "map-t1-g06-er") {
      assert.ok(content!.minimalPairs.length >= 4, `${id}: pairs >= 4 (hiện ${content!.minimalPairs.length})`);
    }
  }
});

test("mỗi word có soundGroupId khớp nhóm + targetPhonemes không rỗng", () => {
  for (const id of NEW_GROUPS) {
    const content = getContentBySoundGroup(id);
    for (const w of content!.words) {
      assert.equal(w.soundGroupId, id, `word "${w.word}" soundGroupId sai: ${w.soundGroupId} (mong đợi ${id})`);
      assert.ok(w.targetPhonemes.length > 0, `word "${w.word}" thiếu targetPhonemes`);
      assert.ok(w.ipa.startsWith("/"), `word "${w.word}" ipa phải bắt đầu bằng /`);
    }
  }
});

test("không còn id cũ map-t4-g01 / map-t4-g03 trong content", () => {
  const allIds = Object.keys(LESSON_CONTENT_BY_SOUND_GROUP);
  assert.ok(!allIds.includes("map-t4-g01-front-vowel-mix"), "Còn id cũ map-t4-g01-front-vowel-mix");
  assert.ok(!allIds.includes("map-t4-g03-final-drop"), "Còn id cũ map-t4-g03-final-drop");
});

test("tổng số nhóm có content >= 10 (3 cũ + 7 mới)", () => {
  assert.ok(Object.keys(LESSON_CONTENT_BY_SOUND_GROUP).length >= 10, `Ít nhất 10 nhóm content (hiện ${Object.keys(LESSON_CONTENT_BY_SOUND_GROUP).length})`);
});
