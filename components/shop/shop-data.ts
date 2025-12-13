
export type Product = {
  id: string;
  title: string;
  category: string;
  scale: string;
  price: number;
  image: string;
  isNew?: boolean;
  inStock: boolean;
};

export const products: Product[] = [
  {
    id: "1",
    title: "F-14D Super Tomcat 'Grim Reapers'",
    category: "Aircraft",
    scale: "1:48",
    price: 89.99,
    image: "/images/products/f14_tomcat_model.png",
    isNew: true,
    inStock: true,
  },
  {
    id: "2",
    title: "M1A2 SEPv3 Abrams",
    category: "Armor",
    scale: "1:35",
    price: 74.50,
    image: "/images/products/m1a2_abrams_model.png",
    inStock: true,
  },
  {
    id: "3",
    title: "U.S.S. Enterprise CVN-65",
    category: "Ships",
    scale: "1:350",
    price: 210.00,
    image: "/images/products/uss_enterprise_model.png",
    inStock: false,
  },
  {
    id: "4",
    title: "Saturn V Rocket",
    category: "Space",
    scale: "1:144",
    price: 129.95,
    image: "/images/products/saturn_v_model.png",
    isNew: true,
    inStock: true,
  },
  {
    id: "5",
    title: "Spitfire Mk.IXc",
    category: "Aircraft",
    scale: "1:32",
    price: 115.00,
    image: "/images/products/spitfire_model.png",
    inStock: true,
  },
  {
    id: "6",
    title: "Tiger I Late Production",
    category: "Armor",
    scale: "1:35",
    price: 68.99,
    image: "/images/products/tiger_tank_model.png",
    inStock: true,
  },
  {
    id: "7",
    title: "Yamato Battleship",
    category: "Ships",
    scale: "1:700",
    price: 45.00,
    image: "/images/products/yamato_battleship_model.png",
    inStock: true,
  },
  {
    id: "8",
    title: "X-Wing Starfighter",
    category: "Sci-Fi",
    scale: "1:72",
    price: 34.99,
    image: "/images/products/xwing_model.png",
    inStock: true,
  },
  {
    id: "9",
    title: "P-51D Mustang 'Big Beautiful Doll'",
    category: "Aircraft",
    scale: "1:48",
    price: 54.99,
    image: "/images/products/p51d_mustang_model.png",
    inStock: true,
  },
  {
    id: "10",
    title: "T-34/85 Soviet Medium Tank",
    category: "Armor",
    scale: "1:35",
    price: 49.99,
    image: "/images/products/t34_85_tank_model.png",
    isNew: true,
    inStock: true,
  },
  {
    id: "11",
    title: "YT-1300 Millennium Falcon",
    category: "Sci-Fi",
    scale: "1:144",
    price: 149.95,
    image: "/images/products/millennium_falcon_model.png",
    inStock: false,
  },
  {
    id: "12",
    title: "RMS Titanic Centenary Edition",
    category: "Ships",
    scale: "1:700",
    price: 59.99,
    image: "/images/products/titanic_ship_model.png",
    inStock: true,
  },
];

export const categories = ["All", "Aircraft", "Armor", "Ships", "Space", "Sci-Fi", "Cars"];
export const scales = ["All", "1:144", "1:72", "1:48", "1:35", "1:32", "1:700", "1:350"];
