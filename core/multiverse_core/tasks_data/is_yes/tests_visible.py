import unittest
from solution import is_yes

class Visible(unittest.TestCase):
    def test_0(self):
        self.assertEqual(is_yes('y'), True)
    def test_1(self):
        self.assertEqual(is_yes('n'), False)

if __name__ == '__main__':
    unittest.main()
