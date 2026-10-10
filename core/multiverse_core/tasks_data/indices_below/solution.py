def indices_below(n):
    if n is None or n < 0 or n > 10**6:
        return []
    out = []
    i = 0
    while i <= n and i < 10**6:
        out.append(i)
        i += 1
    return out
