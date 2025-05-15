export const validateComment = (text: string): string | null => {
    if (text.length < 3) return "Комментарий должен содержать минимум 3 символа";
    if (text.length > 500) return "Комментарий не может быть длиннее 500 символов";
    return null;
};