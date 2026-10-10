import unittest
from solution import newest_entry

class Visible(unittest.TestCase):
    def test_0(self):
        self.assertEqual(newest_entry([1, 2, 3]), 3)
    def test_1(self):
        self.assertEqual(newest_entry(['a', 'b']), 'b')

if __name__ == '__main__':
    unittest.main()
