import unittest
from solution import is_adult

class Visible(unittest.TestCase):
    def test_0(self):
        self.assertEqual(is_adult(18), True)
    def test_1(self):
        self.assertEqual(is_adult(13), False)

if __name__ == '__main__':
    unittest.main()
