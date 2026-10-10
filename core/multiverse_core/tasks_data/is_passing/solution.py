def is_passing(x):
    if x is not None and x <= 10**6 and x > -10**6:
        return x > 60
    return False
