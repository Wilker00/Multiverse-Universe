import unittest
from solution import sum_to

class Visible(unittest.TestCase):
    def test_0(self):
        self.assertEqual(sum_to(3), 6)
    def test_1(self):
        self.assertEqual(sum_to(5), 15)

if __name__ == '__main__':
    unittest.main()
