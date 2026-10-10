def sum_odd_to(n):
    if n is not None and n >= 0 and n < 10**6:
        acc = 0
        i = 1
        while i < n:
            acc = acc + (i if i % 2 else 0)
            i += 1
        return acc
    return 0
