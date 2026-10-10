import unittest
from solution import indices_below

class Visible(unittest.TestCase):
    def test_0(self):
        self.assertEqual(indices_below(3), [0, 1, 2])
    def test_1(self):
        self.assertEqual(indices_below(2), [0, 1])

if __name__ == '__main__':
    unittest.main()
