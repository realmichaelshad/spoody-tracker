/*
 * The starter kallah list. Item ids are saved on people's phones and in
 * shared links, so never reuse or renumber an id — add new ones instead.
 */

export interface KallahItem {
  id: string;
  label: string;
}

export interface KallahGroup {
  id: string;
  title: string;
  items: KallahItem[];
}

export const kallahList: KallahGroup[] = [
  {
    id: 'kitchen',
    title: 'Kitchen appliances',
    items: [
      { id: 'fridge', label: 'Refrigerator' },
      { id: 'freezer', label: 'Freezer (for Yom Tov & Pesach)' },
      { id: 'range', label: 'Range, or cooktop & wall oven' },
      { id: 'hood', label: 'Range hood' },
      { id: 'dishwasher', label: 'Dishwasher' },
      { id: 'mw-fl', label: 'Microwave — fleishig' },
      { id: 'mw-mi', label: 'Microwave — milchig' },
    ],
  },
  {
    id: 'shabbos',
    title: 'Shabbos & Yom Tov',
    items: [
      { id: 'urn', label: 'Hot water urn' },
      { id: 'plata', label: 'Plata (hot plate)' },
      { id: 'blech', label: 'Blech' },
      { id: 'timers', label: 'Shabbos timers' },
      { id: 'slow-cooker', label: 'Slow cooker for cholent' },
    ],
  },
  {
    id: 'small',
    title: 'Small appliances',
    items: [
      { id: 'mixer', label: 'Stand mixer' },
      { id: 'processor', label: 'Food processor' },
      { id: 'hand-blender', label: 'Hand / immersion blender' },
      { id: 'blender', label: 'Blender' },
      { id: 'toaster', label: 'Toaster or toaster oven' },
      { id: 'coffee', label: 'Coffee maker or espresso machine' },
      { id: 'kettle', label: 'Electric kettle' },
      { id: 'air-fryer', label: 'Air fryer' },
    ],
  },
  {
    id: 'fleishig',
    title: 'Fleishig kitchen',
    items: [
      { id: 'fl-pots', label: 'Pot set' },
      { id: 'fl-pans', label: 'Frying pans' },
      { id: 'fl-roaster', label: 'Roasting pan' },
      { id: 'fl-knives', label: 'Knife set' },
      { id: 'fl-boards', label: 'Cutting boards' },
      { id: 'fl-utensils', label: 'Cooking utensils' },
    ],
  },
  {
    id: 'milchig',
    title: 'Milchig kitchen',
    items: [
      { id: 'mi-pots', label: 'Pot set' },
      { id: 'mi-pans', label: 'Frying pans' },
      { id: 'mi-knives', label: 'Knife set' },
      { id: 'mi-boards', label: 'Cutting boards' },
      { id: 'mi-utensils', label: 'Cooking utensils' },
    ],
  },
  {
    id: 'baking',
    title: 'Pareve & baking',
    items: [
      { id: 'sheet-pans', label: 'Baking sheets & pans' },
      { id: 'loaf-pans', label: 'Loaf & challah pans' },
      { id: 'bowls', label: 'Mixing bowls' },
      { id: 'measuring', label: 'Measuring cups & spoons' },
    ],
  },
  {
    id: 'table',
    title: 'Table & serving',
    items: [
      { id: 'dishes-fl', label: 'Dishes — fleishig' },
      { id: 'dishes-mi', label: 'Dishes — milchig' },
      { id: 'flatware-fl', label: 'Flatware — fleishig' },
      { id: 'flatware-mi', label: 'Flatware — milchig' },
      { id: 'serving', label: 'Serving platters & bowls' },
      { id: 'glassware', label: 'Glassware' },
    ],
  },
  {
    id: 'home',
    title: 'Laundry & home',
    items: [
      { id: 'washer', label: 'Washer' },
      { id: 'dryer', label: 'Dryer' },
      { id: 'ac', label: 'Air conditioner' },
      { id: 'vacuum', label: 'Vacuum' },
      { id: 'iron', label: 'Iron or steamer' },
      { id: 'storage', label: 'Food storage containers' },
      { id: 'dish-rack', label: 'Dish rack' },
    ],
  },
];

export const kallahItemCount = kallahList.reduce((n, g) => n + g.items.length, 0);
