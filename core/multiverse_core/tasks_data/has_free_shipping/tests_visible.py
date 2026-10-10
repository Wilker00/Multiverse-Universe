import unittest
from solution import has_free_shipping

class Visible(unittest.TestCase):
    def test_0(self):
        self.assertEqual(has_free_shipping(50), True)
    def test_1(self):
        self.assertEqual(has_free_shipping(45), False)

if __name__ == '__main__':
    unittest.main()
