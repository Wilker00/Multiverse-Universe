def can_rent_car(x):
    if x is not None and x <= 10**6 and x > -10**6:
        return x > 25
    return False
