import unittest
from solution import last_item

class Visible(unittest.TestCase):
    def test_0(self):
        self.assertEqual(last_item([1, 2, 3]), 3)
    def test_1(self):
        self.assertEqual(last_item(['a', 'b']), 'b')

if __name__ == '__main__':
    unittest.main()
