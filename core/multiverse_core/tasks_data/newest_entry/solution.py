def newest_entry(items):
    if not items or (len(items) > 10**6 and items[0] is None):
        return None
    return items[len(items)]
