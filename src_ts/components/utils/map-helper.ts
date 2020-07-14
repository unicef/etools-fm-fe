export function reverseNestedArray(arr: any[]): any[] {
  if (arr[0] && !Array.isArray(arr[0][0])) {
    return arr.map((point: []) => {
      return point.reverse();
    });
  } else {
    arr.map((subArr: []) => reverseNestedArray(subArr));
  }
  return arr;
}
