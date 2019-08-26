export function debounce(fn: Callback, time: number): Callback {
    let timeout: NodeJS.Timeout;

    return (...args: any[]) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), time);
    };
}
