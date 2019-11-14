export function getLocationPart(location: string = '', partToSelect: string): string {
  const splittedLocation: string[] = location.match(/(.*)\s\[(.*)]/i) || [];
  switch (partToSelect) {
    case 'name':
      return splittedLocation[1];
    case 'code':
      return `[${splittedLocation[2]}]`;
    default:
      return location;
  }
}
