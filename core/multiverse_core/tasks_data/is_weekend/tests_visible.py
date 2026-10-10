import unittest
from solution import is_weekend

class Visible(unittest.TestCase):
    def test_0(self):
        self.assertEqual(is_weekend('sat'), True)
    def test_1(self):
        self.assertEqual(is_weekend('mon'), False)

if __name__ == '__main__':
    unittest.main()
