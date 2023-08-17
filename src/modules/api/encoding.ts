export const encode = (text: string): string => {
    return Array.from(new TextEncoder().encode(text))
        .map(byte => byte.toString(16).padStart(2, '0')).join('');
}