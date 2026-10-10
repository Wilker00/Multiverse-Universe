import unittest
from solution import is_primary

class Visible(unittest.TestCase):
    def test_0(self):
        self.assertEqual(is_primary('red'), True)
    def test_1(self):
        self.assertEqual(is_primary('green'), False)

if __name__ == '__main__':
    unittest.main()
