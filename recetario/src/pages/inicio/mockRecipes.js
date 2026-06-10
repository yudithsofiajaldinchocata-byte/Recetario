export const MOCK_RECIPES = [
  {
    id: 1,
    title: "Tarta de Loto y Chocolate",
    category: "Postres",
    difficulty: "Medio",
    prepTime: "45 min",
    servings: 8,
    cost: "Medio",
    rating: 4.9,
    description: "Un delicioso postre sedoso sin horno con base de galletas de canela Biscoff y ganache de chocolate trufado.",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80"
    ],
    ingredients: [
      { name: "Galletas Biscoff trituradas", amount: 200, unit: "g" },
      { name: "Mantequilla derretida sin sal", amount: 80, unit: "g" },
      { name: "Chocolate oscuro picado (70%)", amount: 250, unit: "g" },
      { name: "Crema para batir caliente", amount: 200, unit: "ml" },
      { name: "Esencia de vainilla de Madagascar", amount: 1, unit: "cdta." },
      { name: "Sal marina gruesa (tostado/decoración)", amount: 1, unit: "pizca" }
    ],
    steps: [
      "Triturar las galletas Biscoff finamente hasta obtener textura de arena de mar.",
      "Mezclar las galletas trituradas con la mantequilla derretida y verter sobre un molde para tarta desmontable de 20cm. Presionar los bordes y base, y refrigerar por 15 minutos.",
      "Calentar la crema para batir a fuego lento en una olla pequeña por unos 3 minutos hasta que burbujee en los bordes.",
      "Retirar de la estufa y verter inmediatamente sobre el chocolate oscuro picado. Dejar reposar por 2 minutos sin tocar.",
      "Mezclar suavemente desde el centro en círculos hasta formar una emulsión ganache suave y brillante. Añadir la vainilla.",
      "Verter el chocolate sobre la base de galletas. Esparcir y reposar en el refrigerador por al menos 4 horas hasta que cuaje.",
      "Decorar la superficie con migajas de galletas y espolvorear sal marina antes de cortar."
    ]
  },
  {
    id: 2,
    title: "Risotto de Setas Silvestres",
    category: "Almuerzo",
    difficulty: "Medio",
    prepTime: "35 min",
    servings: 4,
    cost: "Premium",
    rating: 4.8,
    description: "Clásico risotto italiano cremoso cocinado lentamente con setas variadas frescas, parmesano maduro y vino blanco aromático.",
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=800&auto=format&fit=crop&q=80"
    ],
    ingredients: [
      { name: "Arroz Arborio de alta calidad", amount: 320, unit: "g" },
      { name: "Setas frescas rebanadas (champiñones y shiitakes)", amount: 400, unit: "g" },
      { name: "Caldo de verduras muy caliente", amount: 1.2, unit: "L" },
      { name: "Cebolla blanca picada finamente", amount: 1, unit: "unidad" },
      { name: "Vino blanco seco de mesa", amount: 120, unit: "ml" },
      { name: "Queso Parmesano Reggiano rallado", amount: 60, unit: "g" },
      { name: "Mantequilla a temperatura de bloque", amount: 50, unit: "g" },
      { name: "Aceite de oliva extra virgen prensado en frío", amount: 2, unit: "cdas." }
    ],
    steps: [
      "Calentar el aceite de oliva en una olla amplia y saltear las setas fileteadas con una pizca de sal durante 5 minutos. Reservar un puñado para decorar al final.",
      "En la misma olla, derretir la mitad de la mantequilla y sofreír la cebolla picada a fuego medio-bajo hasta que esté tierna por unos 5 minutos.",
      "Añadir el arroz Arborio y tostar los granos revolviendo de forma constante por unos 2 minutos.",
      "Agregar el vino blanco seco y mezclar hasta que se reduzca por completo y el alcohol se evapore.",
      "Comenzar a verter el caldo caliente a cucharones de uno en uno, revolviendo despacio hasta que el arroz absorba casi toda la humedad antes de agregar el siguiente cucharón.",
      "Continuar este proceso por unos 18 minutos hasta lograr una textura de grano al dente pero salsa cremosa. Integrar las setas salteadas a mitad del proceso.",
      "Apagar el fuego, agregar el queso parmesano rallado y la mantequilla restante. Mantecar batiendo enérgicamente durante 1 minuto.",
      "Cubrir y dejar reposar al vapor 2 minutos. Servir coronado con setas doradas y perejil picado."
    ]
  },
  {
    id: 3,
    title: "Tacos al Pastor Gourmet",
    category: "Cena",
    difficulty: "Difícil",
    prepTime: "60 min",
    servings: 4,
    cost: "Medio",
    rating: 5.0,
    description: "Tacos de cerdo marinados en adobo tradicional de chiles secos, asados al sartén para simular el trompo de pastor con piña asada.",
    image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80"
    ],
    ingredients: [
      { name: "Filetes finos de lomo o pulpa de cerdo", amount: 800, unit: "g" },
      { name: "Pasta concentrada de Achiote", amount: 50, unit: "g" },
      { name: "Chiles guajillo desvenados y suavizados", amount: 3, unit: "piezas" },
      { name: "Vinagre de caña o blanco", amount: 60, unit: "ml" },
      { name: "Jugo natural de piña dulce", amount: 120, unit: "ml" },
      { name: "Piña miel rebanada", amount: 0.5, unit: "unidad" },
      { name: "Cilantro y cebolla morada picados", amount: 1, unit: "taza" },
      { name: "Tortillas calientes de maíz", amount: 16, unit: "piezas" }
    ],
    steps: [
      "Licuar la pasta de achiote, los chiles guajillo suavizados en agua hirviendo, el vinagre, el jugo de piña, ajo, sal, y orégano seco hasta tener una salsa homogénea y colarla.",
      "Untar los filetes de cerdo con esta salsa de adobo, apilándolos en un recipiente hermético. Marinar en el refrigerador por al menos 4 horas.",
      "Calentar una plancha antiadherente a fuego alto y sellar las rebanadas de piña por ambos lados durante 3 minutos hasta que caramelicen. Cortar en dados pequeños y reservar.",
      "En la misma plancha caliente con un poco de aceite de cocina, asar los filetes marinados muy rápido hasta que queden tostados por fuera y jugosos dentro. Picar en trozos pequeños estilo pastor.",
      "Calentar las tortillas de maíz en la misma sartén para que absorban los jugos dorados de la carne.",
      "Servir sobre tortillas con abundante carne al pastor, pedazos de piña asada, cebolla picada y cilantro picadito.",
      "Decorar con limones y salsa picante roja."
    ]
  },
  {
    id: 4,
    title: "Tostada de Aguacate y Huevo Poché",
    category: "Desayuno",
    difficulty: "Fácil",
    prepTime: "15 min",
    servings: 2,
    cost: "Económico",
    rating: 4.7,
    description: "Pan tostado crujiente untado con aguacate cremoso, terminado con huevo poché y semillas de ajonjolí.",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80"
    ],
    ingredients: [
      { name: "Pan de hogaza o masa madre tostado", amount: 2, unit: "rebanadas" },
      { name: "Aguacates Hass maduros grandes", amount: 2, unit: "unidades" },
      { name: "Huevos orgánicos frescos", amount: 2, unit: "unidades" },
      { name: "Jugo exprimido de limón", amount: 0.5, unit: "unidad" },
      { name: "Semillas tostadas de sésamo blanco", amount: 1, unit: "cdta." },
      { name: "Hojuelas de chile picante deshidratado", amount: 1, unit: "pizca" },
      { name: "Sal de grano grueso y pimienta recién molida", amount: 1, unit: "al gusto" },
      { name: "Vinagre blanco estándar (para el poché)", amount: 1, unit: "cda." }
    ],
    steps: [
      "Tostar rebanadas gruesas de pan de masa madre en un tostador o con un poco de aceite de oliva en un sartén caliente.",
      "Machacar la pulpa de los aguacates con sal, pimienta negra molida y el jugo de limón usando un tenedor hasta tener una consistencia untable pero con trozos rústicos.",
      "En una olla mediana, verter agua hasta 3/4 partes y calentar a fuego medio. Añadir la cucharada de vinagre y esperar a que hierva muy suavemente.",
      "Crear un remolino ligero agitando el agua caliente con una cuchara de madera en círculos.",
      "Romper un huevo en un pocillo de vidrio y verterlo despacio en el centro exacto del remolino. Cocinar sin mover por exactamente 3 minutos.",
      "Retirar el huevo pochado con una espumadera y escurrir el exceso de agua con cuidado sobre una toalla absorbente de papel.",
      "Repetir el procedimiento para el otro huevo.",
      "Dividir el aguacate machacado sobre las rebanadas de pan tostadas. Colocar encima un huevo poché en cada rebanada.",
      "Decorar la parte superior con semillas de sésamo, pimienta extra, y hojuelas de chile al gusto."
    ]
  },
  {
    id: 5,
    title: "Limonada Lavanda Refrescante",
    category: "Bebidas",
    difficulty: "Fácil",
    prepTime: "20 min",
    servings: 4,
    cost: "Económico",
    rating: 4.9,
    description: "Una refrescante limonada hecha a base de sirope de flores secas de lavanda culinaria y jugo fresco de limones maduros.",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1536935338788-846bb9981813?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=800&auto=format&fit=crop&q=80"
    ],
    ingredients: [
      { name: "Jugo fresco de limón Meyer exprimido", amount: 200, unit: "ml" },
      { name: "Agua purificada helada", amount: 1, unit: "L" },
      { name: "Flores limpias secas de lavanda de cocina", amount: 2, unit: "cdas." },
      { name: "Azúcar granulada blanca fina", amount: 150, unit: "g" },
      { name: "Agua natural para almíbar", amount: 250, unit: "ml" },
      { name: "Cubos de hielo cristalino y rodajas frescas de limón", amount: 1, unit: "al gusto" }
    ],
    steps: [
      "Preparar el almíbar de lavanda: colocar en una olla los 250ml de agua y los 150g de azúcar a calentar a fuego medio hasta disolver los cristales.",
      "Retirar del calor e incorporar de inmediato las flores secas de lavanda. Dejar reposar tapado por 15 minutos para impregnar aroma.",
      "Colar la infusión fina de sirope de azúcar de lavanda para descartar los residuos de flores y meter al refrigerador para enfriar totalmente.",
      "Obtener los 200ml de jugo exprimiendo limones frescos y colando las semillas.",
      "En una jarra de cristal de dos litros de capacidad, mezclar el sirope de lavanda frío, el jugo de limón fresco colado y el litro de agua fría.",
      "Revolver vigorosamente. Servir en vasos llenos de hielo, decorar con rodajas de limón y aromatizar con una ramita fresca si se desea."
    ]
  }
];
