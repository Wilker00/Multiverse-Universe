import unittest
from solution import is_passing

class Visible(unittest.TestCase):
    def test_0(self):
        self.assertEqual(is_passing(60), True)
    def test_1(self):
        self.assertEqual(is_passing(55), False)

if __name__ == '__main__':
    unittest.main()
