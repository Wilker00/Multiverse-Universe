import unittest
from solution import final_score

class Visible(unittest.TestCase):
    def test_0(self):
        self.assertEqual(final_score([1, 2, 3]), 3)
    def test_1(self):
        self.assertEqual(final_score(['a', 'b']), 'b')

if __name__ == '__main__':
    unittest.main()
