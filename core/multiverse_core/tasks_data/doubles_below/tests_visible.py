import unittest
from solution import doubles_below

class Visible(unittest.TestCase):
    def test_0(self):
        self.assertEqual(doubles_below(3), [0, 2, 4])
    def test_1(self):
        self.assertEqual(doubles_below(2), [0, 2])

if __name__ == '__main__':
    unittest.main()
