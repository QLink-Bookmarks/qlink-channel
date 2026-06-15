const INVITE_SHARE_PHRASES = [
  "이 공유 폴더에 초대했어요!",
  "과 함께 링크를 모아볼까요?",
  "이 큐링크 공유 폴더로 초대해요!",
  "이 같이 정리하자고 보냈어요!",
  "의 공유 폴더 초대장이 도착했어요!",
  "이 함께 보고 싶은 폴더가 있대요!",
  "이 큐 하나 같이 채워볼래요?",
  "의 공유 폴더에 들어와 주세요!",
] as const;

const INVITE_SHARE_TITLE = "QLINK 공유 폴더 초대";

type BuildInviteShareTextInput = {
  username: string;
  inviteUrl: string;
};

function buildInviteShareText({ username, inviteUrl }: BuildInviteShareTextInput): {
  title: string;
  text: string;
} {
  const phrase = INVITE_SHARE_PHRASES[Math.floor(Math.random() * INVITE_SHARE_PHRASES.length)];
  const text = `${inviteUrl}\n\n${username}님${phrase}`;
  return { title: INVITE_SHARE_TITLE, text };
}

export { buildInviteShareText, INVITE_SHARE_PHRASES, INVITE_SHARE_TITLE };
export type { BuildInviteShareTextInput };
