export function nullValidate<T>(value: T | null | undefined) : T {
    if(!value) throw new Error('null validation failed');
    return value;
}