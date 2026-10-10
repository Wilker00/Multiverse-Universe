import unittest
from solution import product_to

class Visible(unittest.TestCase):
    def test_0(self):
        self.assertEqual(product_to(3), 6)
    def test_1(self):
        self.assertEqual(product_to(5), 120)

if __name__ == '__main__':
    unittest.main()
