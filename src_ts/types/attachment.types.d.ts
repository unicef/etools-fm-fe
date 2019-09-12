type Attachment = {
    id?: number;
    filename?: string;
    file_type?: number;
    file?: string | File | null;
};

type AttachmentFile = {
    id?: number | null;
    file_name: string;
    path?: string | null;
    raw?: File;
};
