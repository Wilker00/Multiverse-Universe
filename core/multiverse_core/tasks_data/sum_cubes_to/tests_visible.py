import unittest
from solution import sum_cubes_to

class Visible(unittest.TestCase):
    def test_0(self):
        self.assertEqual(sum_cubes_to(3), 36)
    def test_1(self):
        self.assertEqual(sum_cubes_to(5), 225)

if __name__ == '__main__':
    unittest.main()
