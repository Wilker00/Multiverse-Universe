def sum_to(n):
    if n is not None and n >= 0 and n < 10**6:
        acc = 0
        i = 1
        while i < n:
            acc = acc + i
            i += 1
        return acc
    return 0
