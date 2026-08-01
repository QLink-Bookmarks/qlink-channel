// 공지/피드백 본문에 이미지·버튼·링크를 섞어 넣기 위한 최소 태그 문법.
//   [img:https://...]
//   [btn:라벨|https://...]
//   [link:라벨|https://...]
// 태그가 없으면 예전처럼 통짜 텍스트로 렌더되므로 기존 글은 그대로 동작한다.

type PostBlock =
  | { kind: "text"; value: string }
  | { kind: "image"; url: string }
  | { kind: "button"; label: string; url: string }
  | { kind: "link"; label: string; url: string };

const TAG_PATTERN = /\[(img|btn|link):([^\]]+)\]/g;

// 본문은 DB에서 오므로 웹에서 javascript: 같은 스킴이 열리지 않도록 막는다.
function isSafeUrl(value: string): boolean {
  return /^https?:\/\//i.test(value.trim());
}

function toBlock(tag: string, payload: string): PostBlock | null {
  if (tag === "img") {
    const url = payload.trim();
    return isSafeUrl(url) ? { kind: "image", url } : null;
  }

  const separator = payload.indexOf("|");
  if (separator < 0) {
    return null;
  }
  const label = payload.slice(0, separator).trim();
  const url = payload.slice(separator + 1).trim();
  if (!label || !isSafeUrl(url)) {
    return null;
  }
  return tag === "btn" ? { kind: "button", label, url } : { kind: "link", label, url };
}

function pushText(blocks: PostBlock[], value: string) {
  const trimmed = value.replace(/^\n+|\n+$/g, "");
  if (trimmed) {
    blocks.push({ kind: "text", value: trimmed });
  }
}

function parsePostContent(contents: string): PostBlock[] {
  const blocks: PostBlock[] = [];
  let lastIndex = 0;

  for (const match of contents.matchAll(TAG_PATTERN)) {
    const block = toBlock(match[1], match[2]);
    if (!block) {
      // 문법이 틀렸거나 안전하지 않은 URL이면 원문 그대로 남겨 내용이 사라지지 않게 한다.
      continue;
    }
    pushText(blocks, contents.slice(lastIndex, match.index));
    blocks.push(block);
    lastIndex = (match.index ?? 0) + match[0].length;
  }

  pushText(blocks, contents.slice(lastIndex));
  return blocks;
}

export { isSafeUrl, parsePostContent };
export type { PostBlock };
