type SourceType = "INPUT" | "QR";

type CreateLinkRequest = {
  url: string;
  title: string;
  summary?: string;
  memo?: string;
  tags: string[];
  thumbnailUrl?: string;
  sourceType: SourceType;
  reminderAt?: string;
};

type CreateLinkResponse = {
  success: boolean;
  data: {
    id: number;
  };
};

export type { CreateLinkRequest, CreateLinkResponse, SourceType };
