import unittest
from solution import tail_value

class Visible(unittest.TestCase):
    def test_0(self):
        self.assertEqual(tail_value([1, 2, 3]), 3)
    def test_1(self):
        self.assertEqual(tail_value(['a', 'b']), 'b')

if __name__ == '__main__':
    unittest.main()
