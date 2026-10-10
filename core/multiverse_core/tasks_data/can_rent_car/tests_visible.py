import unittest
from solution import can_rent_car

class Visible(unittest.TestCase):
    def test_0(self):
        self.assertEqual(can_rent_car(25), True)
    def test_1(self):
        self.assertEqual(can_rent_car(20), False)

if __name__ == '__main__':
    unittest.main()
