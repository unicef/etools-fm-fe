export function debounce(fn: Callback, time: number): Callback {
    let timeout: NodeJS.Timeout;

    return () => {
        clearTimeout(timeout);
        timeout = setTimeout(fn, time);
    };
}
