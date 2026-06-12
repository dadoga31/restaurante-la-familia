import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.adminUser.upsert({
    where: { email: "admin@lafamilia.es" },
    update: {},
    create: {
      email: "admin@lafamilia.es",
      password: hashSync("admin2026", 10),
      name: "Administrador",
    },
  });

  const cats = [
    { name: "Entrantes", slug: "entrantes", order: 1 },
    { name: "Principales", slug: "principales", order: 2 },
    { name: "Postres", slug: "postres", order: 3 },
    { name: "Vinos", slug: "vinos", order: 4 },
  ];
  for (const cat of cats) {
    await prisma.category.upsert({ where: { slug: cat.slug }, update: {}, create: cat });
  }

  const [entrantes, principales, postres, vinos] = await Promise.all([
    prisma.category.findUnique({ where: { slug: "entrantes" } }),
    prisma.category.findUnique({ where: { slug: "principales" } }),
    prisma.category.findUnique({ where: { slug: "postres" } }),
    prisma.category.findUnique({ where: { slug: "vinos" } }),
  ]);

  const dishes = [
    { name: "Croquetas de Ibérico", description: "Bechamel cremosa con jamón ibérico artesanal, empanadas a mano", price: 12.5, categoryId: entrantes!.id, isActive: true, isDailyMenu: false, order: 1 },
    { name: "Tataki de Atún Rojo", description: "Atún rojo del Mediterráneo, vinagreta de sésamo y aguacate", price: 18.0, categoryId: entrantes!.id, isActive: true, isDailyMenu: false, order: 2 },
    { name: "Ensalada de Burrata", description: "Burrata fresca, tomate cherry, pesto de albahaca y aceite de oliva virgen", price: 14.5, categoryId: entrantes!.id, isActive: true, isDailyMenu: true, order: 3 },
    { name: "Vieiras a la Plancha", description: "Vieiras gallegas, crema de coliflor ahumada y caviar cítrico", price: 22.0, categoryId: entrantes!.id, isActive: true, isDailyMenu: false, order: 4 },
    { name: "Cochinillo Asado", description: "Cochinillo segoviano al horno, patatas panadera y reducción de manzana", price: 28.5, categoryId: principales!.id, isActive: true, isDailyMenu: false, order: 1 },
    { name: "Lubina a la Sal", description: "Lubina salvaje entera, patatas al vapor y salsa verde", price: 32.0, categoryId: principales!.id, isActive: true, isDailyMenu: true, order: 2 },
    { name: "Carrillera de Ternera", description: "Carrillera braseada 8 horas en vino tinto, puré trufado", price: 24.0, categoryId: principales!.id, isActive: true, isDailyMenu: false, order: 3 },
    { name: "Risotto de Trufa Negra", description: "Arroz carnaroli, trufa negra de Soria, parmesano Reggiano 36 meses", price: 26.0, categoryId: principales!.id, isActive: true, isDailyMenu: false, order: 4 },
    { name: "Coulant de Chocolate", description: "Coulant de chocolate 70% cacao, helado de vainilla de Madagascar", price: 9.0, categoryId: postres!.id, isActive: true, isDailyMenu: true, order: 1 },
    { name: "Tarta de Queso La Familia", description: "Nuestra tarta de queso horneada al estilo vasco, base de galleta artesanal", price: 8.5, categoryId: postres!.id, isActive: true, isDailyMenu: false, order: 2 },
    { name: "Tiramisú Clásico", description: "Receta tradicional italiana, savoiardi, mascarpone, café expresso", price: 8.0, categoryId: postres!.id, isActive: true, isDailyMenu: false, order: 3 },
    { name: "Vega Sicilia Único 2015", description: "Ribera del Duero, Tempranillo y Cabernet Sauvignon. Copa / Botella", price: 28.0, categoryId: vinos!.id, isActive: true, isDailyMenu: false, order: 1 },
    { name: "Albariño Martín Códax", description: "Rías Baixas, Albariño 100%. Fresco, afrutado y mineral. Copa / Botella", price: 9.5, categoryId: vinos!.id, isActive: true, isDailyMenu: false, order: 2 },
    { name: "Rioja Reserva Marqués de Cáceres", description: "D.O.Ca. Rioja, Tempranillo. Madera equilibrada, cuerpo elegante. Copa / Botella", price: 11.0, categoryId: vinos!.id, isActive: true, isDailyMenu: false, order: 3 },
  ];

  for (const dish of dishes) {
    const existing = await prisma.dish.findFirst({ where: { name: dish.name } });
    if (!existing) await prisma.dish.create({ data: dish });
  }

  console.log("✓ Seed completado");
}

main().catch(console.error).finally(() => prisma.$disconnect());
