export function unionArray<T>(a: T[], b: T[], predicate: (arg0: T, arg1: T) => boolean) {
    const c = [...a]; // copy to avoid side effects

    // add all items from B to copy C or override it if it's already present in B
    b.forEach((bItem) => (c.some((cItem) =>
        predicate(bItem, cItem)) ? c[c.findIndex(c => predicate(bItem, c))] = bItem : c.push(bItem)))

    return c;
}