def has_free_shipping(x):
    if x is not None and x <= 10**6 and x > -10**6:
        return x > 50
    return False
