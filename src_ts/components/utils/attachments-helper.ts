export function getTypeDisplayName(id: number, types: AttachmentType[]): string {
  const type: AttachmentType | undefined = types.find((item: AttachmentType) => item.id === id);
  return (type && type.label) || '';
}
