const SHARE_PHRASES = [
  "이 추천해요!",
  "의 유익한 링크에요!",
  "의 북마크 한 번 보실래요?",
  "의 큐링크!",
  "의 오늘의 발견!",
  "이 골라봤어요!",
  "이 좋아하는 링크에요!",
  "이 함께 보고 싶은 링크!",
  "의 추천 큐!",
  "의 픽이에요!",
] as const;

const SHARE_TITLE = "QLINK 링크 공유";

type BuildShareTextInput = {
  nickname: string;
  linkTitle: string;
  linkUrl: string;
};

function buildShareText({ nickname, linkTitle, linkUrl }: BuildShareTextInput): {
  title: string;
  text: string;
  url: string;
} {
  const phrase = SHARE_PHRASES[Math.floor(Math.random() * SHARE_PHRASES.length)];
  const text = `${nickname}님${phrase}\n\n${linkTitle}`;
  return { title: SHARE_TITLE, text, url: linkUrl };
}

export { SHARE_PHRASES, SHARE_TITLE, buildShareText };
