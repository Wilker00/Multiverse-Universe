import unittest
from solution import count_squares_to

class Visible(unittest.TestCase):
    def test_0(self):
        self.assertEqual(count_squares_to(3), 14)
    def test_1(self):
        self.assertEqual(count_squares_to(5), 55)

if __name__ == '__main__':
    unittest.main()
