import unittest
from solution import is_senior

class Visible(unittest.TestCase):
    def test_0(self):
        self.assertEqual(is_senior(65), True)
    def test_1(self):
        self.assertEqual(is_senior(60), False)

if __name__ == '__main__':
    unittest.main()
