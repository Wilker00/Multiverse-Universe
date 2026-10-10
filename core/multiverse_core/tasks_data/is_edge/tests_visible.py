import unittest
from solution import is_edge

class Visible(unittest.TestCase):
    def test_0(self):
        self.assertEqual(is_edge(0), True)
    def test_1(self):
        self.assertEqual(is_edge(50), False)

if __name__ == '__main__':
    unittest.main()
