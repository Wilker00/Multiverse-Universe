import unittest
from solution import sum_odd_to

class Visible(unittest.TestCase):
    def test_0(self):
        self.assertEqual(sum_odd_to(3), 4)
    def test_1(self):
        self.assertEqual(sum_odd_to(5), 9)

if __name__ == '__main__':
    unittest.main()
