import { GiClothes, GiRunningShoe, GiSmartphone, GiLaptop, GiShoppingBag, GiHouse, GiGamepad, GiCarWheel, GiMuscleUp, GiBookshelf, GiKnifeFork, GiCardboardBox } from 'react-icons/gi'

export const iconList = [
  {
    name: 'Fashion',
    value: 'GiClothes',
    icon: GiClothes,
  },
  {
    name: 'Shoes',
    value: 'GiRunningShoe',
    icon: GiRunningShoe,
  },
  {
    name: 'Mobiles',
    value: 'GiSmartphone',
    icon: GiSmartphone,
  },
  {
    name: 'Laptops',
    value: 'GiLaptop',
    icon: GiLaptop,
  },
  {
    name: 'Bags',
    value: 'GiShoppingBag',
    icon: GiShoppingBag,
  },
  {
    name: 'Home',
    value: 'GiHouse',
    icon: GiHouse,
  },
  {
    name: 'Toys',
    value: 'GiGamepad',
    icon: GiGamepad,
  },
  {
    name: 'Automobile',
    value: 'GiCarWheel',
    icon: GiCarWheel,
  },
  {
    name: 'Sports',
    value: 'GiMuscleUp',
    icon: GiMuscleUp,
  },
  {
    name: 'Books',
    value: 'GiBookshelf',
    icon: GiBookshelf,
  },
  {
    name: 'Food',
    value: 'GiKnifeFork',
    icon: GiKnifeFork,
  },
  {
    name: 'Grocery',
    value: 'GiCardboardBox',
    icon: GiCardboardBox,
  },
]

// value → component
export const iconMap = Object.fromEntries(iconList.map((item) => [item.value, item.icon]))
