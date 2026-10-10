import unittest
from solution import squares_below

class Visible(unittest.TestCase):
    def test_0(self):
        self.assertEqual(squares_below(3), [0, 1, 4])
    def test_1(self):
        self.assertEqual(squares_below(2), [0, 1])

if __name__ == '__main__':
    unittest.main()
